import { GameSearch } from "@/features/games/types"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import { Check, Gamepad2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Props {
  game: GameSearch
  onClick?(): void
  href?: string
  isSelected?: boolean
  selectionOrder?: number
  removable?: boolean
  compact?: boolean
  className?: string
}

function FavGameCard({
  game,
  onClick,
  href,
  isSelected = false,
  selectionOrder,
  removable = false,
  compact = false,
  className,
}: Props) {
  const gameCover = game.imageUrl || game.backgroundImage
  const releaseYear =
    game.releaseDate && dayjs(game.releaseDate).isValid()
      ? dayjs(game.releaseDate).format("YYYY")
      : null

  const content = (
    <div className="relative aspect-2/3 w-full overflow-hidden rounded-[inherit] bg-muted/20">
      <div className="absolute inset-0 z-10 bg-linear-to-t from-background/95 via-background/30 to-transparent" />
      {gameCover ? (
        <Image
          src={gameCover}
          alt={`${game.title} cover`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          className="absolute inset-0 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground/50">
          <Gamepad2 className="size-6" />
        </div>
      )}

      {selectionOrder !== undefined && (
        <div className="absolute top-1.5 left-1.5 z-20 flex size-5 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-bold text-primary-foreground shadow-sm sm:size-6 sm:text-xs">
          {selectionOrder}
        </div>
      )}

      {isSelected && selectionOrder === undefined && (
        <div className="absolute top-1.5 right-1.5 z-20 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm sm:size-6">
          <Check className="size-3 sm:size-3.5" />
        </div>
      )}

      {removable && (
        <div className="absolute top-1.5 right-1.5 z-20 flex size-5 items-center justify-center rounded-full bg-background/80 text-foreground opacity-100 backdrop-blur-xs transition-all group-hover:bg-destructive group-hover:text-destructive-foreground sm:size-6 sm:opacity-0 sm:group-hover:opacity-100">
          <X className="size-3 sm:size-3.5" />
        </div>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end",
          compact ? "p-1.5 sm:p-2" : "p-2 sm:p-3"
        )}
      >
        <h3
          className={cn(
            "truncate font-heading font-bold uppercase transition-colors group-hover:text-primary",
            compact
              ? "text-[10px] leading-tight sm:text-xs"
              : "text-xs leading-tight sm:text-sm"
          )}
        >
          {game.title}
        </h3>
        {!compact && (
          <span className="truncate font-mono text-[10px] text-muted-foreground sm:text-xs">
            {releaseYear ?? "TBA"}
          </span>
        )}
      </div>
    </div>
  )

  const sharedClasses = cn(
    "group relative block min-w-0 w-full overflow-hidden rounded-lg border transition-all duration-300",
    onClick || href ? "cursor-pointer" : "",
    isSelected
      ? "border-primary ring-2 ring-primary/40"
      : "border-border hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/5",
    className
  )

  if (href && !onClick) {
    return (
      <Link href={href} className={sharedClasses}>
        {content}
      </Link>
    )
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={sharedClasses}
    >
      {content}
    </div>
  )
}

export default FavGameCard
