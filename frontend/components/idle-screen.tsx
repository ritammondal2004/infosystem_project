"use client"

import { Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function IdleScreen({ onStart }: { onStart: () => void }) {
  const [showOverlay, setShowOverlay] = useState(true)

  const onToggleOverlay = () => {
    webgazer.showFaceOverlay(!showOverlay).showFaceFeedbackBox(!showOverlay)
    setShowOverlay(!showOverlay)
  }

  return (
    <div className="flex-1 grid grid-cols-2 h-[calc(100vh-3.6rem)] mx-64">  
      <div className="flex flex-col items-center justify-center gap-22">
        <div id="video-preview-slot" className="flex items-center justify-center" />
        <Button variant="outline" onClick={onToggleOverlay} className="gap-2 font-semibold cursor-pointer">
          Toggle Face Overlay
        </Button>

      </div>

      <div className="flex flex-col items-center justify-center space-y-6 p-12">
        <h1 className="text-3xl font-extrabold">Ready to Start?</h1>
        <p className="text-muted-foreground max-w-md text-center font-medium">
          This session requires fullscreen mode for accurate eye tracking.
          Please sit comfortably and ensure your face is well-lit.
        </p>
      
        <Button onClick={onStart} className="gap-2 font-bold px-10 py-5 cursor-pointer">
          <Maximize className="w-5 h-5" />
          Enter Fullscreen & Start
        </Button>
      </div>
    </div>
  )
}