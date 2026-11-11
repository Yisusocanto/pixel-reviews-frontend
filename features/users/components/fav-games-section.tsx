"use client"

import { Skeleton } from "@/components/ui/skeleton"
import FavGameCard from "@/features/games/components/fav-game-card"
import FavGamesSelector from "@/features/users/components/fav-games-selector"
import { useUserFavGames } from "@/features/users/hooks"
import { Gamepad2, PlusCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

interface Props {
  username: string
}

function FavGamesSection({ username }: Props) {
  const { data: session } = useSession()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const { data, isLoading, isError } = useUserFavGames(username)

  const ownProfile = session?.user.username === username

  if (isError) return null
  if (!isLoading && !ownProfile && (!data || data.length === 0)) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-heading text-2xl font-bold">Favorite Games</h2>
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
                />
              )
            })}
      </div>
    </div>
  )
}

export default FavGamesSection
