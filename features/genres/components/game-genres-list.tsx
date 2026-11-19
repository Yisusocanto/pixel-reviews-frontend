import { Genre } from "@/features/genres/types"
import { getGenreTheme } from "./genre-badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Props {
  genres: Genre[]
  className?: string
}

export function GameGenresList({ genres, className }: Props) {
  if (!genres || genres.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {genres.map((genre) => {
        const theme = getGenreTheme(genre.slug, genre.name)
        const Icon = theme.icon

        return (
          <Link
            key={genre.slug || genre.id}
            href={`/search?q=${encodeURIComponent(genre.name)}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-heading text-xs font-bold tracking-wider uppercase backdrop-blur-xs transition-all duration-200",
              theme.badgeClass
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            <span>{genre.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
