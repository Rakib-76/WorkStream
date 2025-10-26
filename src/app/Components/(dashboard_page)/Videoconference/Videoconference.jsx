"use client"
import { useState } from "react"
import MeetingRoom from "./MeetingRoom"
import { ArrowRight, Video, Users, Zap } from "lucide-react"
import CreateMeetingModal from "../../CreateMeetingModal"
import JoinMeetingModal from "../../JoinMeetingModal"
import { Button_meet } from "../../(dashboard_page)/UI/Button_meet"
// import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [activeMeetingData, setActiveMeetingData] = useState(null)

  const handleStartMeeting = (meetingData) => {
    setActiveMeetingData(meetingData)
    setShowCreateModal(false)
  }

  const handleJoinMeeting = (meetingData) => {
    setActiveMeetingData(meetingData)
    setShowJoinModal(false)
  }

  if (activeMeetingData) {
    return (
      <MeetingRoom
        name={activeMeetingData.name}
        code={activeMeetingData.code}
        mic={activeMeetingData.mic}
        camera={activeMeetingData.camera}
      />
    )
  }

  return (
    <main className=" bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="w-8 h-8 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Video Conferencing</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Connect with Anyone,{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Anywhere
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
            Crystal-clear video meetings with instant screen sharing, real-time collaboration, and seamless
            connectivity.
          </p>
        </div>

        {/* Features */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          <div className="glass rounded-lg p-4 text-left">
            <Zap className="w-6 h-6 text-purple-400 mb-2" />
            <h3 className="font-semibold text-white mb-1">Lightning Fast</h3>
            <p className="text-sm text-gray-400">Optimized for speed and reliability</p>
          </div>

          <div className="glass rounded-lg p-4 text-left">
            <Users className="w-6 h-6 text-blue-400 mb-2" />
            <h3 className="font-semibold text-white mb-1">Group Ready</h3>
            <p className="text-sm text-gray-400">Support for unlimited participants</p>
          </div>

          <div className="glass rounded-lg p-4 text-left">
            <Video className="w-6 h-6 text-pink-400 mb-2" />
            <h3 className="font-semibold text-white mb-1">HD Quality</h3>
            <p className="text-sm text-gray-400">Crystal-clear video and audio</p>
          </div>
        </div> */}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button_meet
            onClick={() => setShowCreateModal(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-lg px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/50 transition-all hover:shadow-purple-500/70"
          >
            Create Meeting
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button_meet>

          <Button_meet
            onClick={() => setShowJoinModal(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/50 transition-all hover:shadow-blue-500/70"
          >
            Join Meeting
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button_meet>

          <Button_meet
            size="lg"
            variant="outline"
            className="border-2 border-purple-400 text-purple-300 hover:bg-purple-500/10 rounded-lg px-8 py-6 text-lg font-semibold bg-transparent"
          >
            Learn More
          </Button_meet>
        </div>

        {/* Footer text */}
        <p className="text-sm text-gray-400 pt-4">No credit card required • Free for up to 100 participants</p>
      </div>

      {/* Modals */}
      <CreateMeetingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onStartMeeting={handleStartMeeting}
      />

      <JoinMeetingModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinMeeting={handleJoinMeeting}
      />
    </main>
  )
}
