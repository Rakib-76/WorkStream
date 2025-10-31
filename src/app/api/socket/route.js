// app/api/socket/route.js
import { Server } from "socket.io";

let io;

export const GET = async () => {
  if (!io) {
    io = new Server(globalThis.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {

      // 📨 Message sending
      socket.on("send-message", (data) => {
        io.emit("receive-message", data);
      });

      // 🔔 Notification sending (for task/project updates)
      socket.on("send-notification", (notification) => {
        io.emit("receive-notification", notification);
      });

      socket.on("disconnect", () => {
      });
    });
  }

  return new Response("Socket server running", { status: 200 });
};
