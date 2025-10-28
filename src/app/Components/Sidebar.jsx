"use client"

import { useState } from "react"
import { Button_meet } from "../Components/(dashboard_page)/UI/Button_meet"
import { X, MessageSquare, Users, FileText } from "lucide-react"

export default function Sidebar({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("chat")

  const participants = [
    { id: 1, name: "You", isActive: true, isMuted: false },
    { id: 2, name: "Alice Johnson", isActive: true, isMuted: false },
    { id: 3, name: "Bob Smith", isActive: true, isMuted: true },
    { id: 4, name: "Carol White", isActive: true, isMuted: false },
  ]

  const messages = [
    { id: 1, sender: "Alice Johnson", text: "Hey everyone!", timestamp: "2:15 PM" },
    { id: 2, sender: "You", text: "Hi Alice!", timestamp: "2:16 PM" },
    { id: 3, sender: "Bob Smith", text: "Good to see you all", timestamp: "2:17 PM" },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose}></div>}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-purple-900/95 to-blue-900/95 border-l border-purple-500/30 backdrop-blur-sm z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 md:relative md:w-80 md:h-screen`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h2 className="text-white font-semibold">Meeting Details</h2>
          <Button_meet onClick={onClose} variant="ghost" size="sm" className="md:hidden text-gray-300 hover:text-white">
            <X className="w-5 h-5" />
          </Button_meet>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-500/20">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "chat"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "participants"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Users className="w-4 h-4" />
            People
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "notes"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            Notes
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "chat" && (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{msg.sender}</p>
                    <p className="text-xs text-gray-500">{msg.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-300 bg-black/30 rounded px-3 py-2">{msg.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "participants" && (
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.isMuted ? "Muted" : "Active"}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-3">
              <textarea
                placeholder="Add meeting notes..."
                className="w-full h-32 bg-black/30 border border-purple-500/30 text-white placeholder:text-gray-500 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-purple-500/50"
              />
              <Button_meet className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Save Notes</Button_meet>
            </div>
          )}
        </div>

        {/* Chat Input */}
        {activeTab === "chat" && (
          <div className="border-t border-purple-500/20 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-black/30 border border-purple-500/30 text-white placeholder:text-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50"
              />
              <Button_meet className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4">Send</Button_meet>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
