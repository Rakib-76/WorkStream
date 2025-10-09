import { Server } from "socket.io";

let io;

export const GET = async (req) => {
  if (!io) {
    io = new Server(globalThis.server || 3000, {
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("send-message", (msg) => {
        io.emit("receive-message", msg);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket server running", { status: 200 });
};
