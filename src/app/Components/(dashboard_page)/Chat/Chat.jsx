
"use client";
import { useState } from "react";
import { MoreVertical, Send } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Anthony Lewis", text: "Hi John, I wanted to update you on a new company policy regarding remote work.", time: "08:00 AM", me: false },
    { id: 2, sender: "Anthony Lewis", text: "Do you have a moment?", time: "08:00 AM", me: false },
    { id: 3, sender: "You", text: "Sure, Sarah. What’s the new policy?", time: "08:00 AM", me: true },
    { id: 4, sender: "Anthony Lewis", text: "Starting next month, we’ll be implementing a hybrid work model.", time: "08:01 AM", me: false },
  ]);

  const [newMsg, setNewMsg] = useState("");

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "You", text: newMsg, time: "Now", me: true }]);
    setNewMsg("");
  };

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div className="w-1/4 border-r  p-4">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <input
          type="text"
          placeholder="Search For Contacts or Messages"
          className="w-full p-2 border rounded mb-4  bg-gray-800 text-amber-100 text-sm"
        />
        <div className="space-y-4">
          <div className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded">
            <img src="https://randomuser.me/api/portraits/men/10.jpg" className="w-10 h-10 rounded-full" alt="" />
            <div className="flex-1">
              <h3 className="font-medium">Anthony Lewis</h3>
              <p className="text-xs text-gray-500">is typing...</p>
            </div>
            <span className="text-xs text-gray-400">02:40 PM</span>
          </div>

          <div className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded">
            <img src="https://randomuser.me/api/portraits/women/11.jpg" className="w-10 h-10 rounded-full" alt="" />
            <div className="flex-1">
              <h3 className="font-medium">Elliot Murray</h3>
              <p className="text-xs text-gray-500">Document</p>
            </div>
            <span className="text-xs text-gray-400">06:12 AM</span>
          </div>

          <div className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded">
            <img src="https://randomuser.me/api/portraits/men/12.jpg" className="w-10 h-10 rounded-full" alt="" />
            <div className="flex-1">
              <h3 className="font-medium">Stephan Peralt</h3>
              <p className="text-xs text-red-500">Missed Video Call</p>
            </div>
            <span className="text-xs text-gray-400">03:15 AM</span>
          </div>

          <div className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded">
            <img src="https://randomuser.me/api/portraits/women/13.jpg" className="w-10 h-10 rounded-full" alt="" />
            <div className="flex-1">
              <h3 className="font-medium">Rebecca Smith</h3>
              <p className="text-xs">Hi How are you 🔥</p>
            </div>
            <span className="text-xs bg-red-500 text-white rounded-full px-2">25</span>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-3">
            <img src="https://randomuser.me/api/portraits/men/10.jpg" className="w-10 h-10 rounded-full" alt="" />
            <div>
              <h3 className="font-medium">Anthony Lewis</h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
          <MoreVertical className="text-gray-500 cursor-pointer" />
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.me ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-xl max-w-xs ${msg.me ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
                <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex items-center bg-white">
          <input
            type="text"
            placeholder="Type Your Message"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 p-2 border rounded mr-2"
          />
          <button onClick={handleSend} className="bg-orange-500 text-white p-2 rounded-full">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
