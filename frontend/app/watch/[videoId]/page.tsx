"use client"

import { AlertCircle } from "lucide-react"
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useState, useEffect, useRef, useReducer } from "react"
import { Video } from "@/types"
import VideoPlayer from "@/components/video-player"
import IdleScreen from "@/components/idle-screen"
import CalibrationOverlay from "@/components/calibration-overlay"

type WatchState = {
  status: "LOADING" | "IDLE" | "CALIBRATING" | "PLAYING" | "SUMMARY" | "ERROR"
  video: Video | null
  error: string | null
}

type Action = 
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Video }
  | { type: "LOAD_FAIL"; payload: string }
  | { type: "START_CALIBRATION" }
  | { type: "START_PLAYING" }
  | { type: "END_SESSION" }
  | { type: "SET_ERROR"; payload: string }

function reducer(state: WatchState, action: Action): WatchState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, status: "LOADING", error: null }
    case "LOAD_SUCCESS":
      return { ...state, status: "IDLE", video: action.payload }
    case "LOAD_FAIL":
      return { ...state, status: "ERROR", error: action.payload }
    case "START_CALIBRATION":
      return { ...state, status: "CALIBRATING", error: null }
    case "START_PLAYING":
      return { ...state, status: "PLAYING" }
    case "END_SESSION":
      return { ...state, status: "SUMMARY" }
    case "SET_ERROR":
      return { ...state, status: "ERROR", error: action.payload }
    default:
      return state
  }
}

const initialState: WatchState = {
  status: "LOADING",
  video: null,
  error: null,
}

export default function WatchPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [showReentryDialog, setShowReentryDialog] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const videoContainer = document.getElementById("webgazerVideoContainer")

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoId = window.location.pathname.split('/')[2];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${videoId}`)
        if (response.ok) {
          const video = await response.json()
          await webgazer.showVideo(true).begin()
          dispatch({ type: "LOAD_SUCCESS", payload: video })
        } else {
          console.error("Failed to fetch video")
          webgazer.end()
          dispatch({ type: "LOAD_FAIL", payload: "Unable to fetch content" })
        }
      } catch (error) {
        console.error("Error fetching video:", error)
        webgazer.end()
        dispatch({ type: "LOAD_FAIL", payload: "An error occurred while fetching content" })
      }
    };

    fetchVideo();
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        if (state.status === "CALIBRATING" || state.status === "PLAYING") {
          setShowReentryDialog(true)
        }
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [state.status])

  useEffect(() => {    
    const slot = document.getElementById("video-preview-slot")
    const video = document.getElementById("webgazerVideoFeed")

    if (videoContainer && video &&  slot && state.status === "IDLE") {
      slot.appendChild(videoContainer)
      
      videoContainer.style.position = "relative" 
      videoContainer.style.top = "auto"
      videoContainer.style.left = "auto"
      videoContainer.style.margin = "0"
      videoContainer.style.borderRadius = "1rem"
      videoContainer.style.overflow = "hidden"
      videoContainer.style.border = "2px solid hsl(var(--border))"
      videoContainer.style.transform = "scale(1.5)"
    }
  }, [state.status])

  const enterFullscreenAndStart = async () => {
    if (!containerRef.current) return
    webgazer.showPredictionPoints(true)
    const gazeDot = document.getElementById("webgazerGazeDot")

    try {
      containerRef.current.appendChild(gazeDot!)
      await containerRef.current.requestFullscreen()
      if (!videoContainer)
        throw new Error("Critical Error: Video Stream Lost")

      document.body.appendChild(videoContainer)
      videoContainer.style.position = "fixed"
      videoContainer.style.top = "0px"
      videoContainer.style.left = "0px"
      videoContainer.style.transform = "scale(1)"
      webgazer.showVideo(false)

      dispatch({ type: "START_CALIBRATION" })
    } catch (err) {
      console.warn("Fullscreen denied:", err)
      webgazer.end()
      dispatch({ type: "SET_ERROR", payload: "Fullscreen is required to proceed. Please allow fullscreen access" })
    }
  }

  const finishCalibration = () => {
    dispatch({ type: "START_PLAYING"})
  };

  const handleVideoEnd = () => {
    // window.webgazer.pause(); // Save resources
    // setViewState("SUMMARY");
  }

  const handleStopSession = () => {
    setShowReentryDialog(false)
    webgazer.showPredictionPoints(false).end()
    if (state.status === "CALIBRATING") {
      dispatch({ type: "SET_ERROR", payload: "Calibration cancelled. Please refresh and try again" })
    } else {
      dispatch({ type: "END_SESSION" })
    }
  }

  const handleResumeFullscreen = async () => {
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen()
        setShowReentryDialog(false)
      } catch (e) {
        console.error("Failed to re-enter fullscreen")
      }
    }
  }

  return (
    <div ref={containerRef} className="bg-background">
      {state.status === "IDLE" && (
        <IdleScreen onStart={enterFullscreenAndStart} />
      )}

      {state.status === "LOADING" &&
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground font-semibold">Loading content...</div>
        </div>
      }

      {state.status === "ERROR" && (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <div className="text-lg font-semibold text-foreground">
            Error
          </div>
          <p className=" text-muted-foreground">
            {state.error || "An unexpected error occurred"}
          </p>
        </div>
      )}


      {state.status === "CALIBRATING" && (
        <CalibrationOverlay onComplete={finishCalibration} onCancel={() => {}}/>
      )}

      {state.status === "PLAYING" && (
        <div className="container mx-auto">
          <VideoPlayer video={state.video} onEnded={handleVideoEnd} />
        </div>
      )}

      {/* {viewState === "SUMMARY" && ()} */}

      {showReentryDialog && (
        <div className="fixed inset-0 z-[999] bg-background/20 backdrop-blur-md transition-all duration-100 animate-in fade-in" />
      )}

      <AlertDialog open={showReentryDialog}>
        <AlertDialogContent className="z-[1000]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="font-extrabold">Fullscreen Paused</div>
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
                {state.status === "CALIBRATING" 
                  ? "Calibration requires fullscreen. Resume to continue, or stop to cancel."
                  : "Playback requires fullscreen. Resume to watch, or finish the session."
                }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStopSession} className="cursor-pointer">
              {state.status === "CALIBRATING" ? "Stop Calibration" : "Finish Session"}
            </AlertDialogCancel>
            
            <AlertDialogAction onClick={handleResumeFullscreen} className="cursor-pointer">
              Resume Fullscreen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}