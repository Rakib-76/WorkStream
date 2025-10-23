"use client"

import { useState, useRef, useEffect } from "react"
import { Button_meet } from "../Components/(dashboard_page)/UI/Button_meet"
import { Input } from "../Components/(dashboard_page)/UI/Input"
import { Mic, MicOff, Video, VideoOff, AlertCircle, RefreshCw, CheckCircle, X } from "lucide-react"

export default function JoinMeetingModal({ isOpen, onClose, onJoinMeeting }) {
  const [meetingCode, setMeetingCode] = useState("")
  const [userName, setUserName] = useState("")
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [cameraError, setCameraError] = useState(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [cameraSkipped, setCameraSkipped] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(window.location.search)
      const codeFromUrl = params.get("code")
      if (codeFromUrl) {
        setMeetingCode(codeFromUrl)
      }
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && isCameraOn && !cameraSkipped) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [isCameraOn, cameraSkipped, isOpen])

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Your browser does not support camera access")
        setIsCameraOn(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      })

      setCameraError(null)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      let errorMessage = "Unable to access camera"

      if (error.name === "NotAllowedError") {
        errorMessage =
          "Camera permission denied. Please allow camera access in your browser settings or skip this step."
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera device found. Please check your hardware."
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera is in use by another application. Please close it and try again."
      } else if (error.name === "SecurityError") {
        errorMessage = "Camera access is not allowed in this context (HTTPS required)."
      }

      setCameraError(errorMessage)
      setIsCameraOn(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleRetryCamera = async () => {
    setIsRetrying(true)
    setCameraError(null)
    setCameraSkipped(false)
    setIsCameraOn(true)
    await startCamera()
    setIsRetrying(false)
  }

  const handleSkipCamera = () => {
    setCameraSkipped(true)
    stopCamera()
    setIsCameraOn(false)
  }

  const handleJoinMeeting = () => {
    if (meetingCode.trim() && userName.trim()) {
      onJoinMeeting({
        code: meetingCode,
        name: userName,
        camera: isCameraOn.toString(),
        mic: isMicOn.toString(),
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-purple-500/20 bg-purple-900/50 backdrop-blur">
          <h2 className="text-2xl font-bold text-white">Join Meeting</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Camera preview */}
          <div className="relative rounded-2xl overflow-hidden bg-black/50 border border-purple-500/30 aspect-video">
            {isCameraOn && !cameraError && !cameraSkipped ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                <div className="text-center">
                  {cameraError && !cameraSkipped ? (
                    <>
                      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <p className="text-red-300 mb-6 text-sm max-w-xs">{cameraError}</p>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <Button_meet
                          onClick={handleRetryCamera}
                          disabled={isRetrying}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        >
                          <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                          {isRetrying ? "Retrying..." : "Retry Camera"}
                        </Button_meet>
                        <Button_meet
                          onClick={handleSkipCamera}
                          variant="outline"
                          className="border-gray-400 text-gray-300 hover:bg-white/10 bg-transparent"
                        >
                          Skip Camera
                        </Button_meet>
                      </div>
                    </>
                  ) : cameraSkipped ? (
                    <>
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <p className="text-green-300 mb-4">Camera skipped</p>
                      <Button_meet
                        onClick={handleRetryCamera}
                        variant="outline"
                        className="border-gray-400 text-gray-300 hover:bg-white/10 bg-transparent"
                      >
                        Enable Camera
                      </Button_meet>
                    </>
                  ) : (
                    <>
                      <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Camera is off</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Camera toggle overlay */}
            {!cameraError && !cameraSkipped && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-3 rounded-full transition-all ${
                    isCameraOn ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full transition-all ${
                    isMicOn ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>

          {/* Form inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-500 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Code</label>
              <Input
                type="text"
                placeholder="Enter meeting code"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-500 rounded-lg font-mono text-lg tracking-widest"
              />
            </div>
          </div>

          {/* Join button */}
          <Button_meet
            onClick={handleJoinMeeting}
            disabled={!meetingCode.trim() || !userName.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-lg py-6 text-lg font-semibold shadow-lg shadow-purple-500/50 transition-all hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Meeting
          </Button_meet>

          {/* Device status */}
          <div className="flex gap-4 justify-center text-sm flex-wrap">
            <div className="flex items-center gap-2 text-gray-300">
              <div
                className={`w-2 h-2 rounded-full ${isCameraOn && !cameraError && !cameraSkipped ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              Camera {isCameraOn && !cameraError && !cameraSkipped ? "On" : "Off"}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className={`w-2 h-2 rounded-full ${isMicOn ? "bg-green-500" : "bg-red-500"}`}></div>
              Microphone {isMicOn ? "On" : "Off"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
