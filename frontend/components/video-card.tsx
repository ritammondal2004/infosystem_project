import { Video } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play } from "lucide-react"
import Image from "next/image"

export function VideoCard({
  id,
  title,
  description,
  source_type,
  meta,
}: Video) {
  const getThumbnail = () => {
    if (source_type === "LOCAL" && meta.thumbnail_url) {
      return meta.thumbnail_url
    }
    if (source_type === "REMOTE" && meta.external_id) {
      if (meta.provider === "youtube") {
        return `https://img.youtube.com/vi/${meta.external_id}/default.jpg`
      }
      if (meta.provider === "vimeo") {
        return `https://vumbnail.com/${meta.external_id}.jpg`
      }
    }

    return ""
  }

  const handleClick = () => {}

  return (
    <Card className="w-80 p-0 overflow-hidden hover:shadow-md group m-4 cursor-pointer" onClick={handleClick}>
      <CardContent className="p-0 relative">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image src={getThumbnail()} alt={title} fill className="object-contain" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 fill-white" />
          </div>
        </div>
      </CardContent>
      <CardHeader className="pb-3">
        <div className="min-w-0 w-full">
          <CardTitle className="truncate text-base group-hover:text-primary overflow-hidden">{title}</CardTitle>
          {description && (
            <CardDescription className="line-clamp-2 text-sm break-words">{description}</CardDescription>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}