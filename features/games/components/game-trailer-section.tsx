"use client"

import { Film, Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface Props {
  videoId?: string | null
  title?: string | null
}

function GameTrailerSection({ videoId, title }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)

  if (!videoId) {
    return null
  }

  const trailerTitle = title || "Official Game Trailer"
  const posterUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-heading text-sm font-bold tracking-widest text-primary uppercase">
          Official Trailer
        </h2>
        {title && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Film aria-hidden="true" className="size-3.5 text-primary" />
            <span>{title}</span>
          </span>
        )}
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg">
        {isLoaded ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={trailerTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsLoaded(true)}
            aria-label={`Play trailer: ${trailerTitle}`}
            className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-zinc-950 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Image
              src={posterUrl}
              alt={trailerTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/30 transition-opacity group-hover:opacity-80" />
            <span className="relative z-10 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl ring-4 ring-black/40 transition-transform duration-300 group-hover:scale-110">
              <Play aria-hidden="true" className="ml-1 size-7 fill-current" />
            </span>
          </button>
        )}
      </div>
    </section>
  )
}

export default GameTrailerSection
