import { Server } from "socket.io";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

let io;

export const GET = async (req) => {
  if (!io) {
    io = new Server(globalThis.server || 3000, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // General chat/message
      socket.on("send-message", (msg) => {
        io.emit("receive-message", msg);
      });

      // Notification event
      socket.on("send_notification", async (data) => {
        try {
          // Save notification to DB
          const notificationsCollection = dbConnect(
            collectionNameObj.notificationsCollection
          );
          await notificationsCollection.insertOne({
            ...data,
            status: "unread",
            createdAt: new Date(),
          });

          // Emit to all connected clients
          io.emit("new_notification", data);
        } catch (err) {
          console.error("Notification save failed:", err);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket server running", { status: 200 });
};
