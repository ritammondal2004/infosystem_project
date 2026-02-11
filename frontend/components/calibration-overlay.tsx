"use client"

import { useState, useEffect, useCallback } from "react"
import { X, CheckCircle2, MousePointerClick } from "lucide-react"
import { cn } from "@/lib/utils"

const CALIBRATION_POINTS = [
  { x: 5, y: 5 }, { x: 50, y: 5 }, { x: 95, y: 5 },
  { x: 5, y: 50 }, { x: 50, y: 50 }, { x: 95, y: 50 },
  { x: 5, y: 95 }, { x: 50, y: 95 }, { x: 95, y: 95 },
]

const CLICKS_REQUIRED = 3

interface CalibrationOverlayProps {
  onComplete: () => void
  onCancel: () => void
}

export default function CalibrationOverlay({ onComplete, onCancel }: CalibrationOverlayProps) {
  const [clickCounts, setClickCounts] = useState<number[]>(new Array(9).fill(0))
 
  useEffect(() => {
    if (clickCounts.every((count) => count >= CLICKS_REQUIRED)) {
      const timer = setTimeout(() => {
        onComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [clickCounts, onComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel()
      }
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onCancel()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [onCancel])

  const handlePointClick = useCallback((index: number) => {
    setClickCounts((prev) => {
      const newCounts = [...prev]
      if (newCounts[index] < CLICKS_REQUIRED) {
        newCounts[index] += 1
      }
      return newCounts
    })
  }, [])

  const totalClicks = clickCounts.reduce((a, b) => a + b, 0)
  const totalRequired = CALIBRATION_POINTS.length * CLICKS_REQUIRED
  const progressPercentage = Math.round((totalClicks / totalRequired) * 100)

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 pointer-events-none max-w-md w-full px-4 z-10">
        <div className="bg-card border shadow-sm p-4 rounded-lg pointer-events-auto">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-primary font-bold" />
            Calibration
          </h2>
          <p className="text-sm font-medium text-muted-foreground m-1">
            Click each red dot <strong>{CLICKS_REQUIRED} times</strong> while looking directly at it.<br /> 
            Keep your head still.
          </p>
          <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {CALIBRATION_POINTS.map((point, index) => {
        const clicks = clickCounts[index]
        const isComplete = clicks >= CLICKS_REQUIRED
        
        let colorClass = "bg-destructive ring-destructive/30"
        if (isComplete) {
            colorClass = "bg-primary ring-primary"
        } else if (clicks > 0) {
            colorClass = "bg-chart-1 ring-chart-1/30"
        }

        const opacityClass = isComplete ? "opacity-50" : "opacity-100"

        return (
          <button
            key={index}
            onClick={() => handlePointClick(index)}
            disabled={isComplete}
            className={cn(
              "absolute w-8 h-8 -ml-4 -mt-4 rounded-full transition-all duration-100 ease-out",
              "ring-4 ring-offset-2 focus:outline-none focus:ring-offset-4",
              !isComplete && "hover:scale-125",
              colorClass,
              opacityClass,
              isComplete ? "cursor-default" : "cursor-pointer"
            )}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
          >
            {isComplete && (
              <CheckCircle2 className="w-full h-full text-primary-foreground p-1" />
            )}
          </button>
        )
      })}
    </div>
  )
}
