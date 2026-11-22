import { Card, CardContent } from "@/components/ui/card"
import StarRating from "@/components/ui/star-rating"
import { GameCover } from "@/features/charts/components/game-cover"
import { TopRatedGame } from "@/features/charts/types"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import { Star } from "lucide-react"
import Link from "next/link"

interface TopRatedSectionProps {
  games: TopRatedGame[]
}

export function TopRatedSection({ games }: TopRatedSectionProps) {
  return (
    <section className="flex flex-col">
      <div className="mb-4">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Rankings
        </span>
        <h2 className="font-heading text-2xl font-extrabold tracking-tight uppercase">
          Top Rated of All Time
        </h2>
      </div>

      <Card className="@container flex-1 py-2">
        <CardContent className="px-2 sm:px-3">
          {games.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No rated games yet.
            </p>
          ) : (
            <ol className="divide-y divide-border/60">
              {games.map((item, i) => {
                const releaseYear =
                  item.game.releaseDate && dayjs(item.game.releaseDate).isValid()
                    ? dayjs(item.game.releaseDate).format("YYYY")
                    : null

                return (
                  <li key={item.game.id}>
                    <Link
                      href={`/games/${item.game.slug}`}
                      className="group/row flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span
                          className={cn(
                            "w-7 shrink-0 text-right font-heading text-xl font-extrabold tabular-nums sm:text-2xl",
                            i < 3 ? "text-primary" : "text-muted-foreground/70"
                          )}
                        >
                          {i + 1}
                        </span>

                        <GameCover
                          imageUrl={item.game.imageUrl}
                          title={item.game.title}
                          size="sm"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-heading text-base font-bold tracking-tight transition-colors group-hover/row:text-primary">
                            {item.game.title}
                          </h3>
                          {releaseYear && (
                            <span className="text-xs text-muted-foreground">
                              {releaseYear}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <div className="hidden @md:block">
                          <StarRating
                            value={item.average}
                            showValue
                            readOnly
                            size="sm"
                          />
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary tabular-nums @md:hidden">
                          <Star
                            className="size-3.5 fill-primary text-primary"
                            aria-hidden="true"
                          />
                          <span>{item.average.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {item.count} {item.count === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
