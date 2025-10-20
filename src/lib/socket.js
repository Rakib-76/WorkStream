// lib/socket.js
import { Server } from "socket.io";

let io;

export function getIo() {
    return io;
}

// Initialize socket server (pages/api/socket.js এ import করা হবে)
export function initSocket(server) {
    if (!io) {
        io = new Server(server, {
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
            socket.on("send_notification", (data) => {
                io.emit("new_notification", data);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }
    return io;
}
