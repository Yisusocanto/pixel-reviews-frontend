import { GameSearch } from "@/features/games/types"
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

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative block aspect-4/3 w-full overflow-hidden border border-t-2 border-border/50 border-t-primary bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/5"
    >
      {game.backgroundImage ? (
        <Image
          alt={game.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={game.backgroundImage}
          className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/30 text-muted-foreground">
          <Gamepad2 className="size-8 opacity-40" />
          <span className="text-xs uppercase tracking-wider">No image</span>
        </div>
      )}
      <div className="absolute inset-0 z-5 bg-linear-to-t from-background via-background/40 to-transparent" />
      <div className="absolute bottom-2 z-10 flex w-full items-center justify-between gap-2 px-3">
        <h2 className="truncate font-heading text-lg font-bold uppercase transition-colors group-hover:text-primary">
          {game.title}
        </h2>
        {formattedDate && (
          <span className="shrink-0 font-mono text-xs font-semibold text-primary border border-border/60 bg-secondary/90 px-1.5 py-0.5">
            {formattedDate}
          </span>
        )}
      </div>
    </Link>
  )
}

export default GameSearchCard

