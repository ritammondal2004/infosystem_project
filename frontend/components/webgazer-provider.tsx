"use client"

import Script from "next/script"

export default function WebgazerProvider() {
  const handleWebgazerInit = () => {
    webgazer.saveDataAcrossSessions(false)
      .showVideo(false)
      .showPredictionPoints(false)
      .begin()
  }

  return (
    <Script src="/webgazer.js" onLoad={handleWebgazerInit} />
  )
}