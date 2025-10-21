// app/api/socket/route.js
import { Server } from "socket.io";

let io;

export const GET = async () => {
  if (!io) {
    io = new Server(globalThis.server || 3000, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);

      // 📨 Message sending
      socket.on("send-message", (data) => {
        console.log("📩 Message received:", data);
        io.emit("receive-message", data);
      });

      // 🔔 Notification sending (for task/project updates)
      socket.on("send-notification", (notification) => {
        console.log("🔔 Notification:", notification);
        io.emit("receive-notification", notification);
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket server running", { status: 200 });
};
