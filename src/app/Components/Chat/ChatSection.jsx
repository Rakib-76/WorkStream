"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatSection({
  room = "global",
  senderId = "anon",
  senderName = "Guest",
  avatarUrl = "https://i.pravatar.cc/40",
}) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef();
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-grow textarea
  const handleTextChange = (e) => {
    setText(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    socketRef.current?.emit("typing", { room, senderName });
    scrollToBottom();
  };

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      socketRef.current = io({ path: "/api/socketio" });

      socketRef.current.on("connect", () => {
        socketRef.current.emit("join-room", room);
      });

      socketRef.current.on("receive-message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      socketRef.current.on("typing", (user) => {
        if (user.senderName !== senderName) {
          setTypingUsers((prev) => [...new Set([...prev, user.senderName])]);
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter((name) => name !== user.senderName));
          }, 2000);
        }
      });
    });

    fetch(`/api/messages?room=${room}&limit=50`)
      .then((r) => r.json())
      .then((data) => setMessages(data))
      .catch(console.error);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [room, senderName]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = {
      room,
      senderId,
      senderName,
      text,
      createdAt: new Date(),
      avatarUrl,
      read: false,
    };
    socketRef.current.emit("send-message", payload); // broadcast
    setMessages((prev) => [...prev, payload]); // show instantly
    setText("");
    textareaRef.current.style.height = "auto";
  };

  return (
    <div className="flex flex-col bg-card border border-border rounded-xl shadow h-full max-w-xl sm:max-w-lg md:max-w-xl mx-auto   transition-colors duration-300">
      
      {/* Header (sticky) */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b font-bold text-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
        💬 {room.charAt(0).toUpperCase() + room.slice(1)}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background dark:bg-gray-900">
        {messages.map((m, i) => {
          const isSender = m.senderId === senderId;
          return (
            <div key={m._id ? m._id : i} className={`flex ${isSender ? "justify-end" : "justify-start"} items-end`}>
              {!isSender && (
                <img
                  src={m.avatarUrl || "https://i.pravatar.cc/40"}
                  alt={m.senderName}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div className={`max-w-[80%] sm:max-w-[70%] md:max-w-[60%] p-2 rounded-lg shadow
                               ${isSender 
                                  ? "bg-blue-500 text-white rounded-br-none dark:bg-blue-600" 
                                  : "bg-gray-200 text-gray-900 rounded-bl-none dark:bg-gray-700 dark:text-gray-100"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{m.text}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-300 ml-2">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {/* Read receipt */}
                {isSender && (
                  <div className="text-[10px] text-gray-300 dark:text-gray-400 text-right mt-1">
                    {m.read ? "✓✓" : "✓"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
            {typingUsers.join(", ")} typing...
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input (auto-growing) */}
      <div className="flex p-3 border-t bg-gray-100 dark:bg-gray-800 gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          rows={1}
          className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
