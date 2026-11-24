import { GameSearch } from "@/features/games/types"
import { getIgdbImageUrl } from "@/lib/igdb-image"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import { Gamepad2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Props {
  game: GameSearch
}

function GameSearchCard({ game }: Props) {
  const formattedDate =
    game.releaseDate && dayjs(game.releaseDate).isValid()
      ? dayjs(game.releaseDate).format("YYYY")
      : null

  const coverOrBackdrop = game.backgroundImage
    ? getIgdbImageUrl(game.backgroundImage, "t_screenshot_big")
    : game.imageUrl
      ? getIgdbImageUrl(game.imageUrl, "t_cover_big")
      : null
  const score = game.criticScore

  const scoreBadgeColor =
    score !== null && score !== undefined
      ? score >= 75
        ? "border-emerald-500/40 bg-emerald-950/85 text-emerald-300"
        : score >= 50
          ? "border-amber-500/40 bg-amber-950/85 text-amber-300"
          : "border-rose-500/40 bg-rose-950/85 text-rose-300"
      : ""

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative block aspect-4/3 w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/10"
    >
      {coverOrBackdrop ? (
        <Image
          alt={game.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={coverOrBackdrop}
          className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground">
          <Gamepad2 className="size-8 opacity-40" />
          <span className="font-mono text-[11px] tracking-widest uppercase">
            No image
          </span>
        </div>
      )}
      {score !== null && score !== undefined && (
        <div
          className={cn(
            "absolute top-3 right-3 z-10 rounded-md border px-2 py-0.5 font-mono text-xs font-bold backdrop-blur-sm",
            scoreBadgeColor
          )}
        >
          {score}
        </div>
      )}
      <div className="absolute inset-0 z-5 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 z-10 flex items-end justify-between gap-2.5 p-3.5">
        <h2 className="truncate font-heading text-base font-bold tracking-tight text-white uppercase drop-shadow-xs transition-colors group-hover:text-primary sm:text-lg">
          {game.title}
        </h2>
        {formattedDate && (
          <span className="shrink-0 rounded-md border border-white/15 bg-zinc-950/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary backdrop-blur-xs">
            {formattedDate}
          </span>
        )}
      </div>
    </Link>
  )
}

export default GameSearchCard
