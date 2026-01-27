"use client";

import React, { useEffect, useRef } from "react";
import { Video } from "@/types";

interface VideoPlayerProps {
  video: Video | null;
  onEnded: () => void;
}

const BATCH_INTERVAL = 3000; // Send data every 3 seconds
const BATCH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/gaze/batch`;

export default function VideoPlayer({ video, onEnded }: VideoPlayerProps) {
//   // --- EYE TRACKING LOGIC ---
//   const bufferRef = useRef<any[]>([]);
//   const batchTimerRef = useRef<NodeJS.Timeout | null>(null);

//   // 1. Function to send data to backend
//   const flushBuffer = async () => {
//     if (bufferRef.current.length === 0) return;

//     // Create a copy and clear the immediate buffer
//     const chunk = [...bufferRef.current];
//     bufferRef.current = [];

//     try {
//       await fetch(BATCH_ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ videoId: video.id, data: chunk }),
//         keepalive: true, // Critical: ensures request survives if page unmounts
//       });
//     } catch (err) {
//       console.error("Failed to sync gaze data:", err);
//     }
//   };

//   useEffect(() => {
//     // 2. Setup WebGazer Listener on Mount
//     if (typeof window !== "undefined" && window.webgazer) {
//       // Resume tracker in case it was paused
//       window.webgazer.resume();

//       window.webgazer.setGazeListener((data: any, clock: number) => {
//         if (data) {
//           bufferRef.current.push({
//             x: Math.round(data.x),
//             y: Math.round(data.y),
//             t: Math.round(clock),
//           });
//         }
//       });
//     }

//     // 3. Start the Batch Timer
//     batchTimerRef.current = setInterval(flushBuffer, BATCH_INTERVAL);

//     // 4. Cleanup on Unmount (Video End or Navigate Away)
//     return () => {
//       if (batchTimerRef.current) clearInterval(batchTimerRef.current);
//       if (typeof window !== "undefined" && window.webgazer) {
//         window.webgazer.clearGazeListener();
//         window.webgazer.pause(); // Save CPU
//       }
//       flushBuffer(); // Final save
//     };
//   }, [video.id]);


//   // Handle YouTube "End" event via PostMessage (No heavy SDK needed)
//   useEffect(() => {
//     if (video.source_type !== "REMOTE") return;

//     const handleMessage = (event: MessageEvent) => {
//       // Filter only messages from YouTube
//       if (!event.origin.includes("youtube.com")) return;

//       try {
//         const data = JSON.parse(event.data);
//         // YouTube Player State "0" means Ended
//         if (data.event === "infoDelivery" && data.info && data.info.playerState === 0) {
//           onEnded();
//         }
//       } catch (e) {
//         // Ignore JSON parse errors from other iframe messages
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [video.source_type, onEnded]);
  if (!video) {
    return <div className="p-4 text-center text-destructive">Video data is unavailable</div>;
  }

  if (video.source_type === "REMOTE") {
    // Note: 'enablejsapi=1' is REQUIRED for onEnded detection
    const embedSrc = `${video.meta.embed_url}?autoplay=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;
    
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg mt-4 mx-4">
        <iframe
          src={embedSrc}
          title={video.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
      </div>
    );
  }

  if (video.source_type === "LOCAL") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg">
        <video
          controls
          autoPlay
          className="h-full w-full"
          onEnded={onEnded}
          poster={video.meta.thumbnail_url || undefined}
        >
          <source src={video.meta.cdn_url} type={video.meta.mime_type} />
          Your browser does not support the video tag
        </video>
      </div>
    );
  }

  return <div className="p-4 text-center text-red-500">Unsupported Video Type</div>;
}