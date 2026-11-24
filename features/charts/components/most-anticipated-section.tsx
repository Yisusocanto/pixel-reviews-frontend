import { Badge } from "@/components/ui/badge-2"
import { GameCover } from "@/features/charts/components/game-cover"
import { TopWantedGame } from "@/features/charts/types"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import { Bookmark } from "lucide-react"
import Link from "next/link"

interface MostAnticipatedSectionProps {
  games: TopWantedGame[]
}

export function MostAnticipatedSection({ games }: MostAnticipatedSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <span className="font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Radar
        </span>
        <h2 className="mt-1 font-heading text-2xl font-black tracking-tight uppercase">
          Most Anticipated
        </h2>
      </div>

      {games.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          No wishlisted games yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((item, i) => {
            const releaseYear =
              item.game.releaseDate && dayjs(item.game.releaseDate).isValid()
                ? dayjs(item.game.releaseDate).format("YYYY")
                : null

            return (
              <Link
                key={item.game.id}
                href={`/games/${item.game.slug}`}
                className="group/row block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <article
                  className={cn(
                    "flex h-full gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
                    i < 3 && "border-l-4 border-l-primary"
                  )}
                >
                  <GameCover
                    imageUrl={item.game.imageUrl}
                    title={item.game.title}
                    size="md"
                    className="self-start"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "font-heading text-xl leading-none font-extrabold tabular-nums",
                            i < 3 ? "text-primary" : "text-muted-foreground/70"
                          )}
                        >
                          #{i + 1}
                        </span>
                        {releaseYear && (
                          <Badge
                            variant="outline"
                            size="sm"
                            shape="circle"
                            className="border-primary/40 text-xs tabular-nums"
                          >
                            {releaseYear}
                          </Badge>
                        )}
                      </div>

                      <h3 className="line-clamp-2 font-heading text-base leading-snug font-bold tracking-tight transition-colors group-hover/row:text-primary">
                        {item.game.title}
                      </h3>

                      {item.game.themes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {item.game.themes.slice(0, 2).map((theme) => (
                            <span
                              key={theme}
                              className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground tabular-nums">
                      <Bookmark
                        className="size-3.5 text-primary"
                        aria-hidden="true"
                      />
                      <span>
                        <strong className="font-semibold text-foreground">
                          {item.count.toLocaleString()}
                        </strong>{" "}
                        {item.count === 1 ? "wishlist" : "wishlists"}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
