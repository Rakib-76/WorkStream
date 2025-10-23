"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Sidebar from "../../Sidebar"
import ControlBar from "../../ControlBar"
import VideoGrid from "../../VideoGrid"
// import VideoGrid from "@/components/video-grid"
// import ControlBar from "@/components/control-bar"
// import Sidebar from "@/components/sidebar"

export default function MeetingRoom() {
  const searchParams = useSearchParams()
  const [participants, setParticipants] = useState([])
  const [userName, setUserName] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const name = searchParams.get("name") || "You"
  const code = searchParams.get("code") || ""
  const mic = searchParams.get("mic")
  const camera = searchParams.get("camera")

  useEffect(() => {
    const currentUser = {
      id: "user-0",
      name: name,
      isActive: true,
      isMuted: mic === "false",
      isCameraOff: camera === "false",
    }

    const mockParticipants = [
      currentUser,
      {
        id: "user-1",
        name: "Alice Johnson",
        isActive: true,
        isMuted: false,
        isCameraOff: false,
      },
      {
        id: "user-2",
        name: "Bob Smith",
        isActive: true,
        isMuted: true,
        isCameraOff: false,
      },
      {
        id: "user-3",
        name: "Carol White",
        isActive: true,
        isMuted: false,
        isCameraOff: true,
      },
    ]

    setUserName(name)
    setParticipants(mockParticipants)
    console.log("[v0] Participants initialized:", mockParticipants)
  }, [name, code, mic, camera])

  const handleToggleMute = (participantId) => {
    setParticipants((prev) => {
      const updated = prev.map((p) => (p.id === participantId ? { ...p, isMuted: !p.isMuted } : p))
      console.log(
        "[v0] Mic toggled for",
        participantId,
        "- Muted:",
        updated.find((p) => p.id === participantId)?.isMuted,
      )
      return updated
    })
  }

  const handleToggleCamera = (participantId) => {
    setParticipants((prev) => {
      const updated = prev.map((p) => (p.id === participantId ? { ...p, isCameraOff: !p.isCameraOff } : p))
      console.log(
        "[v0] Camera toggled for",
        participantId,
        "- Off:",
        updated.find((p) => p.id === participantId)?.isCameraOff,
      )
      return updated
    })
  }

  const handleRemoveParticipant = (participantId) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId))
  }

  const currentUser = participants.find((p) => p.id === "user-0")

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex flex-col lg:flex-row">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="relative z-10 border-b border-purple-500/20 bg-black/20 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Meeting Room</h1>
              <p className="text-sm text-gray-400">{participants.length} participants</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">You: {userName}</p>
              <p className="text-xs text-gray-500">Meeting ID: {code}</p>
            </div>
          </div>
        </header>

        {/* Video Grid */}
        <div className="relative z-10 flex-1 overflow-hidden">
          <VideoGrid
            participants={participants}
            onToggleMute={handleToggleMute}
            onToggleCamera={handleToggleCamera}
            onRemoveParticipant={handleRemoveParticipant}
          />
        </div>

        {/* Control Bar */}
        <ControlBar
          currentUserId="user-0"
          currentUser={currentUser}
          onToggleMute={() => handleToggleMute("user-0")}
          onToggleCamera={() => handleToggleCamera("user-0")}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </main>
  )
}
