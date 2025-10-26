"use client"

import { Mic, MicOff, Video, VideoOff, X } from "lucide-react"
import { Button_meet } from "../Components/(dashboard_page)/UI/Button_meet"

export default function VideoGrid({ participants, onToggleMute, onToggleCamera, onRemoveParticipant }) {
  const getGridClass = () => {
    const count = participants.length
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-2"
    if (count === 3 || count === 4) return "grid-cols-2"
    if (count <= 6) return "grid-cols-3"
    return "grid-cols-4"
  }

  return (
    <div className={`grid ${getGridClass()} gap-4 p-4 h-full auto-rows-fr`}>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 group"
        >
          {/* Video placeholder */}
          <div className="w-full h-full flex items-center justify-center bg-black/40">
            {participant.isCameraOff ? (
              <div className="text-center">
                <VideoOff className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">{participant.name}</p>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <p className="text-white font-semibold">{participant.name}</p>
              </div>
            )}
          </div>

          {/* Participant info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-white text-sm font-medium truncate">{participant.name}</p>
              </div>
              <div className="flex gap-1">
                {participant.isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                {participant.isCameraOff && <VideoOff className="w-4 h-4 text-red-400" />}
              </div>
            </div>
          </div>

          {/* Control buttons - visible on hover */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button_meet
              size="sm"
              variant="ghost"
              onClick={() => onToggleMute(participant.id)}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-auto w-auto"
            >
              {participant.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button_meet>

            <Button_meet
              size="sm"
              variant="ghost"
              onClick={() => onToggleCamera(participant.id)}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-auto w-auto"
            >
              {participant.isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </Button_meet>

            {participant.id !== "user-0" && (
              <Button_meet
                size="sm"
                variant="ghost"
                onClick={() => onRemoveParticipant(participant.id)}
                className="bg-red-500/50 hover:bg-red-600/70 text-white rounded-full p-2 h-auto w-auto"
              >
                <X className="w-4 h-4" />
              </Button_meet>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
