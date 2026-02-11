export interface Video {
    id: string
    title: string
    description?: string
    source_type: "LOCAL" | "REMOTE"
    meta: VideoMeta
}

export interface VideoMeta {
    provider?: string
    external_id?: string
    thumbnail_url?: string
    embed_url?: string
    cdn_url?: string
    mime_type?: string
}

export interface GazePoint {
    x: number
    y: number
    timestamp: number
}

export interface AnalyticsMetrics {
    temporal: Record<string, any>
    spatial: Record<string, any>
    attention: Record<string, any>
    aoi: Record<string, any>
}

export interface AnalyticsResult {
    status: string
    metrics: AnalyticsMetrics
    plots: {
        heatmap: string
        scatter_path: string
        x_time_series: string
        y_time_series: string
    }
}