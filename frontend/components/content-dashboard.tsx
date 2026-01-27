"use client"

import { useEffect, useState } from "react"
import { Film } from "lucide-react"
import { Video } from "@/types"
import { VideoCard } from "@/components/video-card"

export default function ContentDashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`)
        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }
        const data = await response.json()
        setVideos(data)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <div className="w-full p-4">
      {loading && (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-center">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No content available</h3>
            <p className="text-muted-foreground font-medium">Videos will appear here once they're uploaded</p>
          </div>
        </div>
      )}

      {!loading && videos.length > 0 && (
        <div className="flex flex-row flex-wrap justify-center gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              description={video.description}
              source_type={video.source_type}
              meta={video.meta}
            />
          ))}
        </div>
      )}
    </div>
  );
}