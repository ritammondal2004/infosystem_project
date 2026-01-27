"use client"

import { AlertCircle, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef, useReducer } from "react"
import { Video } from "@/types"
import VideoPlayer from "@/components/video-player"

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

  const enterFullscreenAndStart = async () => {
    if (!containerRef.current) return

    try {
      await containerRef.current.requestFullscreen()
      
      // 2. Only if successful, proceed to setup WebGazer
      // if (window.webgazer) {
      //   window.webgazer.setRegression('ridge').setTracker('TFFacemesh').begin();
      //   window.webgazer.showVideoPreview(true);
      // }
      
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
    // // Resume/Start tracking logic here
    // setViewState("PLAYING");
  };

  const handleVideoEnd = () => {
    // window.webgazer.pause(); // Save resources
    // setViewState("SUMMARY");
  }

  return (
    <div ref={containerRef} className="bg-background">
      {/* <Script src="https://webgazer.cs.brown.edu/webgazer.js" onLoad={handleScriptLoad} /> */}

      {state.status === "IDLE" && (
        <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6 p-80">
          <h1 className="text-3xl font-extrabold">Ready to Start?</h1>
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


      {/* {viewState === "CALIBRATING" && (
        <CalibrationOverlay onComplete={finishCalibration} />
      )} */}

      {state.status === "PLAYING" && (
        <div className="container mx-auto">
          <VideoPlayer video={state.video} onEnded={handleVideoEnd} />
        </div>
      )}

      {/* {viewState === "SUMMARY" && ()} */}
    </div>
  );
}