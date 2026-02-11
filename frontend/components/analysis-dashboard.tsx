"use client"

import { AnalyticsResult } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalysisDashboardProps {
  result: AnalyticsResult | null
}

export default function AnalysisDashboard({ result }: AnalysisDashboardProps) {
  // Helper function to format metric labels
  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char, index, str) => {
        // Don't capitalize if inside parentheses
        const beforeParen = str.lastIndexOf('(', index)
        const afterParen = str.indexOf(')', index)
        if (beforeParen !== -1 && (afterParen === -1 || afterParen > index)) {
          return char.toLowerCase()
        }
        return char.toUpperCase()
      })
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temporal Metrics */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold tracking-tight">Temporal Metrics</CardTitle>
              <CardDescription className="text-xs">Time-based measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.temporal && Object.entries(metrics.temporal).map(([key, value]) => (
                <div key={key} className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground leading-none">
                    {formatLabel(key)}
                  </span>
                  <span className="text-base font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Spatial Metrics */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold tracking-tight">Spatial Metrics</CardTitle>
              <CardDescription className="text-xs">Position statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.spatial && Object.entries(metrics.spatial).map(([key, value]) => (
                <div key={key} className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground leading-none">
                    {formatLabel(key)}
                  </span>
                  <span className="text-base font-semibold text-purple-600 dark:text-purple-400 tabular-nums">
                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Attention Metrics */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold tracking-tight">Attention Metrics</CardTitle>
              <CardDescription className="text-xs">Focus and engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.attention && Object.entries(metrics.attention).map(([key, value]) => (
                <div key={key} className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground leading-none">
                    {formatLabel(key)}
                  </span>
                  <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {typeof value === 'number' ? value.toFixed(2) : String(value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Visualizations */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Visualizations</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Interactive visual analysis of gaze patterns
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heatmap */}
            {plots.heatmap && (
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold">Gaze Heatmap</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Areas of high fixation during playback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg overflow-hidden">
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
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold">Gaze Path</CardTitle>
                  <CardDescription className="text-sm mt-1">
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
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold">X Coordinate Time Series</CardTitle>
                  <CardDescription className="text-sm mt-1">
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
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold">Y Coordinate Time Series</CardTitle>
                  <CardDescription className="text-sm mt-1">
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

          {/* AOI Heatmap */}
          <div className="flex justify-center">
            {plots.aoi_heatmap && (
              <Card className="overflow-hidden w-fit hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold">Area of Interest Heatmap</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Attention distribution across screen zones (5×5 grid)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg overflow-auto">
                    <img
                      src={`data:image/png;base64,${plots.aoi_heatmap}`}
                      alt="AOI Heatmap"
                      className="h-auto"
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
