"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatSection({ room = "global", senderId = "anon", senderName = "Guest" }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    // 1) hit the api route once to ensure server initialized
    fetch("/api/socketio")
      .catch((e) => console.warn("socket init failed", e))
      .finally(() => {
        // 2) connect socket
        socketRef.current = io({
          path: "/api/socketio",
        });

        socketRef.current.on("connect", () => {
          socketRef.current.emit("join-room", room);
        });

        socketRef.current.on("receive-message", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      });

    // 3) load history
    fetch(`/api/messages?room=${room}&limit=50`)
      .then((r) => r.json())
      .then((data) => setMessages(data))
      .catch(console.error);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = { room, senderId, senderName, text };
    socketRef.current.emit("send-message", payload);
    setText("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">💬 Chat — {room}</h2>

      <div className="border rounded p-3 h-64 overflow-y-auto mb-3 bg-gray-50">
        {messages.map((m, i) => (
          <div key={m._id ? m._id : i} className="mb-2">
            <div className="text-xs text-black">{m.senderName} • {new Date(m.createdAt).toLocaleTimeString()}</div>
            <div className="bg-black p-2 rounded mt-1 shadow">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border flex-1 rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
      </div>
    </div>
  );
}
