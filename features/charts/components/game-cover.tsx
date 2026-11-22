import { getIgdbImageUrl } from "@/lib/igdb-image"
import { cn } from "@/lib/utils"
import { Gamepad2 } from "lucide-react"
import Image from "next/image"

interface GameCoverProps {
  imageUrl?: string | null
  title: string
  size?: "sm" | "md"
  className?: string
}

const SIZE_STYLES = {
  sm: {
    container: "w-12",
    sizes: "48px",
    icon: "size-5",
  },
  md: {
    container: "w-16",
    sizes: "64px",
    icon: "size-6",
  },
} as const

export function GameCover({
  imageUrl,
  title,
  size = "sm",
  className,
}: GameCoverProps) {
  const { container, sizes, icon } = SIZE_STYLES[size]

  return (
    <div
      className={cn(
        "relative aspect-3/4 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted",
        container,
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={getIgdbImageUrl(imageUrl, "t_cover_big")}
          alt={`${title} cover art`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover/row:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <Gamepad2 className={icon} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
