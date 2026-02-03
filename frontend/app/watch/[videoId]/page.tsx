"use client"

import { AlertCircle, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoId = window.location.pathname.split('/')[2];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${videoId}`)
        if (response.ok) {
          const video = await response.json()
          dispatch({ type: "LOAD_SUCCESS", payload: video })
        } else {
          console.error("Failed to fetch video")
          dispatch({ type: "LOAD_FAIL", payload: "Unable to fetch content" })
        }
      } catch (error) {
        console.error("Error fetching video:", error)
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

  const enterFullscreenAndStart = async () => {
    if (!containerRef.current) return

    try {
      await containerRef.current.requestFullscreen()

      dispatch({ type: "START_CALIBRATION" })
    } catch (err) {
      console.warn("Fullscreen denied:", err)
      dispatch({ type: "SET_ERROR", payload: "Fullscreen is required to proceed. Please allow fullscreen access" })
    }
  }

  const handleScriptLoad = () => {
    // // Initialize WebGazer hidden
    // window.webgazer.setRegression('ridge').setTracker('TFFacemesh').begin();
    // window.webgazer.showVideoPreview(true); // Show only during calibration
  };

  const finishCalibration = () => {
    // window.webgazer.showVideoPreview(false); // Hide camera feed
    // window.webgazer.showPredictionPoints(false); // Hide dots
    dispatch({ type: "START_PLAYING"})
  };

  const handleVideoEnd = () => {
    // window.webgazer.pause(); // Save resources
    // setViewState("SUMMARY");
  }

  const handleStopSession = () => {
    setShowReentryDialog(false)
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
        <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6 p-80">
          <h1 className="text-3xl font-bold">Ready to Start?</h1>
          <p className="text-muted-foreground max-w-md text-center font-medium">
            This session requires fullscreen mode for accurate eye tracking.
            Please sit comfortably and ensure your face is well-lit.
          </p>
          
          <Button onClick={enterFullscreenAndStart} className="gap-2 font-bold px-10 py-5">
              <Maximize className="w-5 h-5" />
              Enter Fullscreen & Start
          </Button>
        </div>
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