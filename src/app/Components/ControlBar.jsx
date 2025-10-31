"use client"

import { useState, useRef } from "react"
import { Button_meet } from "../Components/(dashboard_page)/UI/Button_meet"
import { Mic, MicOff, Video, VideoOff, Phone, Share2, Maximize, Users } from "lucide-react"

export default function ControlBar({ currentUser, onToggleMute, onToggleCamera, onSidebarToggle }) {
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const screenStreamRef = useRef(null)

  const isMuted = currentUser?.isMuted ?? false
  const isCameraOff = currentUser?.isCameraOff ?? false

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop())
        screenStreamRef.current = null
      }
      setIsScreenSharing(false)
    } else {
      // Start screen sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
          audio: false,
        })
        screenStreamRef.current = stream

        // Handle when user stops sharing from browser UI
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          screenStreamRef.current = null
        }

        setIsScreenSharing(true)
      } catch (error) {
        if (error.name !== "NotAllowedError") {
        }
      }
    }
  }

  const handleFullscreen = () => {
    const elem = document.documentElement
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleEndCall = () => {
    if (confirm("Are you sure you want to leave the meeting?")) {
      // Stop screen sharing if active
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      window.location.href = "/"
    }
  }

  const handleMicClick = () => {
    onToggleMute()
  }

  const handleCameraClick = () => {
    onToggleCamera()
  }

  return (
    <>
      {/* Floating Control Bar */}
      <div className="relative z-20 flex justify-center pb-6 px-4">
        <div className="glass rounded-full px-6 py-4 flex items-center gap-4 shadow-lg">
          {/* Microphone */}
          <Button_meet
            onClick={handleMicClick}
            className={`rounded-full p-3 h-auto w-auto transition-all ${
              isMuted ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button_meet>

          {/* Camera */}
          <Button_meet
            onClick={handleCameraClick}
            className={`rounded-full p-3 h-auto w-auto transition-all ${
              isCameraOff ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            title={isCameraOff ? "Turn on camera" : "Turn off camera"}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button_meet>

          {/* Screen Share */}
          <Button_meet
            onClick={handleScreenShare}
            className={`rounded-full p-3 h-auto w-auto transition-all ${
              isScreenSharing
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            <Share2 className="w-5 h-5" />
          </Button_meet>

          {/* Participants */}
          <Button_meet
            onClick={onSidebarToggle}
            className="rounded-full p-3 h-auto w-auto bg-purple-600 hover:bg-purple-700 text-white transition-all"
            title="Show participants"
          >
            <Users className="w-5 h-5" />
          </Button_meet>

          {/* Fullscreen */}
          <Button_meet
            onClick={handleFullscreen}
            className="rounded-full p-3 h-auto w-auto bg-gray-600 hover:bg-gray-700 text-white transition-all"
            title="Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </Button_meet>

          {/* End Call */}
          <div className="w-px h-8 bg-white/20"></div>
          <Button_meet
            onClick={handleEndCall}
            className="rounded-full p-3 h-auto w-auto bg-red-600 hover:bg-red-700 text-white transition-all"
            title="End call"
          >
            <Phone className="w-5 h-5 rotate-[135deg]" />
          </Button_meet>
        </div>
      </div>
    </>
  )
}
