"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import FavGameCard from "@/features/games/components/fav-game-card"
import { useSearchGames } from "@/features/games/hooks/use-games"
import { Game, GameSearch } from "@/features/games/types"
import { useUpdateUserFavGames } from "@/features/users/hooks"
import {
  AlertCircle,
  Flame,
  Loader2,
  RefreshCw,
  Search,
  SearchX,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useDebounce } from "use-debounce"

interface Props {
  games: Game[]
  username: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function FavGamesSelector({
  games,
  username,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen

  const [searchTerm, setSearchTerm] = useState("")
  const [draftGames, setDraftGames] = useState<GameSearch[] | null>(null)
  const selectedGames = draftGames ?? games

  const [debounceTerm, { flush }] = useDebounce(searchTerm, 400)
  const trimmedQuery = debounceTerm.trim()

  const handleOpenChange = (nextOpen: boolean) => {
    setDraftGames(null)
    if (!nextOpen) {
      setSearchTerm("")
    }
    setInternalOpen(nextOpen)
    setControlledOpen?.(nextOpen)
  }

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
    refetch,
  } = useSearchGames(trimmedQuery, isOpen, 20)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "120px",
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const searchGames = data?.pages.flatMap((page) => page.items) ?? []
  const totalResults = data?.pages[0]?.total ?? searchGames.length
  const isDebouncing = searchTerm !== debounceTerm
  const isSearchActive = trimmedQuery.length > 0

  const { mutate: updateFavList, isPending } = useUpdateUserFavGames(username)

  const handleClearSearch = () => {
    setSearchTerm("")
    flush()
  }

  const handleGameSelection = (selectedGame: GameSearch) => {
    setDraftGames((prev) => {
      const current = prev ?? games
      const exists = current.some((game) => game.slug === selectedGame.slug)

      if (exists) {
        return current.filter((game) => game.slug !== selectedGame.slug)
      }

      if (current.length >= 5) {
        toast.add({
          description: "You can only select up to 5 favorite games.",
          type: "warning",
        })
        return current
      }

      return [...current, selectedGame]
    })
  }

  const handleUpdateFavList = () => {
    const slugs = selectedGames.map((game) => game.slug)
    updateFavList(slugs, {
      onSuccess: () => {
        handleOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        Edit favorites
      </DialogTrigger>
      <DialogContent className="flex max-h-[92vh] w-full max-w-[calc(100%-1.5rem)]! flex-col gap-3 overflow-hidden p-4 sm:max-w-2xl! sm:gap-4 sm:p-6 lg:max-w-3xl!">
        <DialogHeader className="shrink-0 pr-8">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-lg font-bold sm:text-xl">
              Pick your five
            </DialogTitle>
            <span className="font-mono text-xs text-muted-foreground">
              {selectedGames.length}/5 selected
            </span>
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            The games that define you. They appear at the top of your profile,
            in this order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid shrink-0 grid-cols-5 gap-1.5 sm:gap-3">
          {Array.from({ length: 5 }, (_, i) => {
            const game = selectedGames[i]
            if (!game) {
              return (
                <div
                  key={i}
                  className="flex aspect-2/3 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 text-muted-foreground"
                >
                  <span className="font-heading text-lg font-extrabold text-muted-foreground/40 sm:text-3xl">
                    {i + 1}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 sm:text-xs">
                    Empty
                  </span>
                </div>
              )
            }

            return (
              <FavGameCard
                game={game}
                key={game.slug}
                selectionOrder={i + 1}
                removable
                compact
                onClick={() => handleGameSelection(game)}
              />
            )
          })}
        </div>

        <div className="shrink-0 space-y-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              type="search"
              placeholder="Search any game by title..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pr-9 pl-9 text-sm sm:h-10 [&::-webkit-search-cancel-button]:hidden"
            />
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
              {isDebouncing && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {!isError && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                  <span>
                    {isSearchActive
                      ? `Searching games for "${trimmedQuery}"...`
                      : "Loading popular games..."}
                  </span>
                </div>
              ) : isSearchActive ? (
                <span>
                  Found{" "}
                  <strong className="font-semibold text-primary">
                    {totalResults}
                  </strong>{" "}
                  {totalResults === 1 ? "result" : "results"} matching{" "}
                  <strong className="text-foreground italic">
                    &quot;{trimmedQuery}&quot;
                  </strong>
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Flame className="size-3.5 text-primary" />
                  <span className="font-heading font-bold tracking-wide text-foreground uppercase">
                    Popular Games
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pr-0.5">
          {isError && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
              <AlertCircle className="mb-2 size-6 text-destructive" />
              <p className="text-xs text-muted-foreground sm:text-sm">
                {error instanceof Error
                  ? error.message
                  : "Failed to load games."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-3 gap-1.5"
              >
                <RefreshCw className="size-3.5" /> Try again
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="aspect-2/3 w-full rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && !isError && searchGames.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/20 p-8 text-center">
              <SearchX className="mb-2 size-7 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No games found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                No matches for &quot;{trimmedQuery}&quot;.
              </p>
              {isSearchActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                  className="mt-3"
                >
                  View popular games
                </Button>
              )}
            </div>
          )}

          {!isLoading && !isError && searchGames.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
                {searchGames.map((game, index) => {
                  const selectedIndex = selectedGames.findIndex(
                    (g) => g.slug === game.slug
                  )
                  const isSelected = selectedIndex !== -1

                  return (
                    <FavGameCard
                      key={`${game.slug}-${index}`}
                      game={game}
                      isSelected={isSelected}
                      selectionOrder={
                        isSelected ? selectedIndex + 1 : undefined
                      }
                      onClick={() => handleGameSelection(game)}
                    />
                  )
                })}
              </div>

              <div
                ref={ref}
                className="flex flex-col items-center justify-center py-4"
              >
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span>Loading more games...</span>
                  </div>
                )}
                {!hasNextPage && searchGames.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    You have reached the end of the results.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="shrink-0 pt-1">
          <Button
            onClick={handleUpdateFavList}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending && <Spinner />}
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FavGamesSelector
