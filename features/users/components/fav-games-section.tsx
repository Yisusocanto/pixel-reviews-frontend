"use client"

import { Skeleton } from "@/components/ui/skeleton"
import FavGameCard from "@/features/games/components/fav-game-card"
import { Game } from "@/features/games/types"
import FavGamesSelector from "@/features/users/components/fav-games-selector"
import { useUserFavGames } from "@/features/users/hooks"
import { Gamepad2, PlusCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

interface Props {
  username: string
  initialGames?: Game[]
}

function FavGamesSection({ username, initialGames }: Props) {
  const { data: session } = useSession()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const { data, isLoading, isError } = useUserFavGames(username, initialGames)

  const ownProfile = session?.user.username === username

  if (isError) return null
  if (!isLoading && !ownProfile && (!data || data.length === 0)) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Hall of Fame
          </span>
          <h2 className="mt-0.5 font-heading text-2xl font-black tracking-tight">
            Favorite Games
          </h2>
        </div>
        {ownProfile && (
          <FavGamesSelector
            games={data ?? []}
            username={username}
            open={selectorOpen}
            onOpenChange={setSelectorOpen}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5 lg:gap-6">
        {isLoading
          ? Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="aspect-2/3 w-full rounded-lg" />
            ))
          : Array.from({ length: 5 }, (_, i) => {
              const game = data ? data[i] : null
              if (!game) {
                if (ownProfile) {
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectorOpen(true)}
                      className="group flex aspect-2/3 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex w-fit flex-col items-center gap-1.5 text-muted-foreground transition-colors group-hover:text-primary">
                        <PlusCircle className="size-6" />
                        <span className="text-xs font-medium sm:text-sm">
                          Add game
                        </span>
                      </div>
                    </button>
                  )
                }

                return (
                  <div
                    key={i}
                    className="flex aspect-2/3 w-full items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/5 text-muted-foreground/30"
                  >
                    <Gamepad2 className="size-6" />
                  </div>
                )
              }

              return (
                <FavGameCard
                  game={game}
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  priority={i < 2}
                />
              )
            })}
      </div>
    </div>
  )
}

export default FavGamesSection
