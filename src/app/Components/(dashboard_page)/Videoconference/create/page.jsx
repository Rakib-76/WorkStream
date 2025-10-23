"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../(dashboard_page)/UI/Button_meet"
import { ArrowLeft, Copy, Mail, Check, Share2 } from "lucide-react"
import Link from "next/link"
import { generateMeetingCode, generateMeetingLink, copyToClipboard, generateGmailShareLink } from "../../../../../lib/meeting_utils"

export default function CreateMeetingPage() {
  const [meetingCode, setMeetingCode] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const code = generateMeetingCode()
    setMeetingCode(code)
    setMeetingLink(generateMeetingLink(code))
  }, [])

  const handleCopyCode = async () => {
    const success = await copyToClipboard(meetingCode)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(meetingLink)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareViaGmail = () => {
    const gmailLink = generateGmailShareLink(meetingCode, userName || "Team Member")
    window.open(gmailLink, "_blank")
  }

  const handleStartMeeting = () => {
    const params = new URLSearchParams({
      code: meetingCode,
      name: userName || "Host",
      camera: "true",
      mic: "true",
    })
    
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Back button */}
      <div className="relative z-10 w-full max-w-2xl mb-8">
        <Link href="/">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Create Meeting</h1>
          <p className="text-gray-300">Generate a meeting link and share with your team</p>
        </div>

        {/* Meeting Code Card */}
        <div className="glass rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-white/10 border border-purple-500/30 text-white placeholder:text-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          {/* Meeting Code Display */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Meeting Code</label>
            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 flex items-center">
                <code className="text-white font-mono text-xl tracking-widest">{meetingCode}</code>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Meeting Link Display */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Meeting Link</label>
            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 flex items-center overflow-hidden">
                <code className="text-blue-300 text-sm truncate">{meetingLink}</code>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium whitespace-nowrap"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3 pt-4 border-t border-purple-500/20">
            <p className="text-sm font-medium text-gray-300">Share with team members:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleShareViaGmail}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                Share via Gmail
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                <Share2 className="w-5 h-5" />
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Start Meeting Button */}
        <Button
          onClick={handleStartMeeting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-lg py-6 text-lg font-semibold shadow-lg shadow-purple-500/50 transition-all hover:shadow-purple-500/70"
        >
          Start Meeting Now
        </Button>

        {/* Info text */}
        <div className="text-center text-sm text-gray-400 space-y-2">
          <p>Share the meeting code or link with your team members</p>
          <p>They can join by entering the code on the join page or clicking the link</p>
        </div>
      </div>
    </main>
  )
}
