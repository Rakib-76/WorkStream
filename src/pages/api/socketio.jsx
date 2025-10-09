// pages/api/socketio.js
import { Server } from "socket.io";
import dbConnect from "../../lib/dbConnect";

export default async function handler(req, res) {
  // If socket already attached, return
  if (res.socket.server.io) {
    // Socket already initialized
    res.end();
    return;
  }

  console.log("-> Initializing Socket.io server");
  const { db } = await dbConnect();
  const messagesCollection = db.collection("chat_messages"); // <-- collection name

  const io = new Server(res.socket.server, {
    path: "/api/socketio",
    cors: {
      origin: "*", // tighten this in production
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // optional: join a default room
    socket.on("join-room", (room = "global") => {
      socket.join(room);
      console.log(`${socket.id} joined ${room}`);
    });

    // client emits 'send-message' with { room, senderId, senderName, text }
    socket.on("send-message", async (payload) => {
      try {
        const messageDoc = {
          room: payload.room || "global",
          senderId: payload.senderId || null,
          senderName: payload.senderName || "Anonymous",
          text: payload.text,
          createdAt: new Date(),
        };

        // save to MongoDB
        const result = await messagesCollection.insertOne(messageDoc);
        messageDoc._id = result.insertedId;

        // broadcast to room
        io.to(messageDoc.room).emit("receive-message", messageDoc);
      } catch (err) {
        console.error("Error saving message:", err);
        // optionally emit error back to sender
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  res.end();
}
