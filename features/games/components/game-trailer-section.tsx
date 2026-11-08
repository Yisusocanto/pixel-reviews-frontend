import { Film } from "lucide-react"

interface Props {
  videoId?: string | null
  title?: string | null
}

function GameTrailerSection({ videoId, title }: Props) {
  if (!videoId) {
    return null
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-heading text-sm font-bold tracking-widest text-primary uppercase">
          Official Trailer
        </h2>
        {title && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Film className="size-3.5 text-primary" />
            <span>{title}</span>
          </span>
        )}
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title || "Official Game Trailer"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </section>
  )
}

export default GameTrailerSection
