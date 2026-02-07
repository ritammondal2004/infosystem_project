"use client"

import { useEffect, useRef } from "react"
import { Video } from "@/types"

interface VideoPlayerProps {
  video: Video | null
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const gazeDataRef = useRef<Array<{ x: number; y: number; timestamp: number }>>([])

  useEffect(() => {
    webgazer.setGazeListener((data: any, timestamp: number) => {
      if (data) {
        gazeDataRef.current.push({
          x: data.x,
          y: data.y,
          timestamp: timestamp,
        })
      }
    })

    return () => {
      webgazer.clearGazeListener()

      if (gazeDataRef.current.length > 0) {
        const blob = new Blob([JSON.stringify(gazeDataRef.current, null, 2)], {
          type: "application/json",
        })
        
        // TODO: Send to backend instead of downloading
        const date = new Date().toISOString().replace(/[:.]/g, "-")
        const filename = `gaze-session-${date}.json`

        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        
        document.body.removeChild(a)
        URL.revokeObjectURL(url)       
      }
    }
  }, [])

  if (!video) {
    return <div className="p-4 text-center text-destructive">Video data is unavailable</div>
  }

  if (video.source_type === "REMOTE") {
    // Note: 'enablejsapi=1' is REQUIRED for onEnded detection
    const embedSrc = `${video.meta.embed_url}?rel=0&autoplay=1&fs=0&modestbranding=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black w-screen h-screen">
        <iframe
          src={embedSrc}
          title={video.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        />
      </div>
    )
  }

  if (video.source_type === "LOCAL") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black w-screen h-screen">
        <video
          controls
          autoPlay
          className="h-full w-full"
          poster={video.meta.thumbnail_url || undefined}
        >
          <source src={video.meta.cdn_url} type={video.meta.mime_type} />
          Your browser does not support the video tag
        </video>
      </div>
    )
  }

  return <div className="p-4 text-center text-red-500">Unsupported Video Type</div>
}