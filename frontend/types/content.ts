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
}