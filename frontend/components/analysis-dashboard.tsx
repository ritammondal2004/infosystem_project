"use client"

import { AnalyticsResult } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalysisDashboardProps {
  result: AnalyticsResult | null
}

export default function AnalysisDashboard({ result }: AnalysisDashboardProps) {
  if (!result || result.status !== "success") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground font-semibold">No analysis data available</div>
      </div>
    )
  }

  const { metrics, plots } = result

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gaze Analysis Results</h1>
            <p className="text-muted-foreground mt-2">
              Detailed insights from your viewing session
            </p>
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temporal Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Temporal Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {metrics.temporal && Object.entries(metrics.temporal).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-medium">
                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Spatial Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Spatial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {metrics.spatial && Object.entries(metrics.spatial).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-medium">
                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Attention Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Attention Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {metrics.attention && Object.entries(metrics.attention).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-medium">
                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AOI Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">AOI Grid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {metrics.aoi && Object.entries(metrics.aoi).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-medium">
                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Visualizations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Visualizations</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heatmap */}
            {plots.heatmap && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Gaze Heatmap</CardTitle>
                  <CardDescription>
                    Areas of high fixation during playback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg overflow-auto">
                    <img
                      src={`data:image/png;base64,${plots.heatmap}`}
                      alt="Gaze Heatmap"
                      className="w-full h-auto"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scatter Path */}
            {plots.scatter_path && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Gaze Path</CardTitle>
                  <CardDescription>
                    Temporal sequencing of gaze points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg overflow-auto">
                    <img
                      src={`data:image/png;base64,${plots.scatter_path}`}
                      alt="Gaze Path"
                      className="w-full h-auto"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Time Series */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plots.x_time_series && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">X Coordinate Time Series</CardTitle>
                  <CardDescription>
                    Horizontal gaze position over time during the session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg overflow-auto">
                    <img
                      src={`data:image/png;base64,${plots.x_time_series}`}
                      alt="X Time Series"
                      className="w-full h-auto"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {plots.y_time_series && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Y Coordinate Time Series</CardTitle>
                  <CardDescription>
                    Vertical gaze position over time during the session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg overflow-auto">
                    <img
                      src={`data:image/png;base64,${plots.y_time_series}`}
                      alt="Y Time Series"
                      className="w-full h-auto"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
