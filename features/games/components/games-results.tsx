"use client"

import { Button } from "@/components/ui/button"
import { SkeletonGroup } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import GameSearchCard from "@/features/games/components/game-search-card"
import GameSearchCardSkeleton from "@/features/games/components/game-search-card-skeleton"
import { useSearchGames } from "@/features/games/hooks/use-games"
import { GameSearchPagination } from "@/features/games/types"
import { AlertCircle, Flame, RefreshCw, SearchX } from "lucide-react"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface Props {
  query: string
  onClear: () => void
  initialData?: GameSearchPagination
}

function GamesResults({ query, onClear, initialData }: Props) {
  const {
    data,
    isLoading,
    isPlaceholderData,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
    refetch,
  } = useSearchGames(query, true, 20, initialData)

  const { ref, inView } = useInView({ threshold: 0, rootMargin: "400px 0px" })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const isSearching = isLoading || isPlaceholderData
  const isSearchActive = query.trim().length > 0
  const games = data?.pages.flatMap((page) => page.items) ?? []
  const totalResults = data?.pages[0]?.total ?? games.length

  return (
    <div>
      {!isError && (
        <div className="mb-6">
          {isSearching ? (
            <div className="flex items-center gap-2" role="status">
              <Spinner className="text-primary" />
              <span className="text-sm text-muted-foreground">
                {isSearchActive
                  ? `Searching games for "${query}"...`
                  : "Loading popular games..."}
              </span>
            </div>
          ) : isSearchActive ? (
            <p className="text-sm text-muted-foreground">
              Found{" "}
              <strong className="font-semibold text-primary">
                {totalResults}
              </strong>{" "}
              {totalResults === 1 ? "game" : "games"} matching{" "}
              <strong className="text-foreground italic">
                &quot;{query}&quot;
              </strong>
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Flame className="size-5 text-primary" />
                <h2 className="font-heading text-xl font-bold tracking-wide uppercase">
                  Popular Games
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Explore trending and top-rated games, or use the search bar
                above to find a specific title.
              </p>
            </div>
          )}
        </div>
      )}

      {isError && (
        <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <div className="mb-3 rounded-full bg-destructive/20 p-3 text-destructive">
            <AlertCircle className="size-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Failed to load games
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while fetching games. Please try again."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 gap-2 border-destructive/40 hover:bg-destructive/20"
          >
            <RefreshCw className="size-4" /> Try again
          </Button>
        </div>
      )}

      {isLoading && (
        <SkeletonGroup
          label="Loading games"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <GameSearchCardSkeleton key={i} />
          ))}
        </SkeletonGroup>
      )}

      {!isLoading && !isError && games.length === 0 && (
        <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/20 p-12 text-center">
          <div className="mb-3 rounded-full bg-muted/40 p-4 text-muted-foreground">
            <SearchX className="size-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            No games found
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t find any games matching{" "}
            <strong className="text-foreground">&quot;{query}&quot;</strong>.
            Try checking for typos or searching with different keywords.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="mt-4"
          >
            View popular games
          </Button>
        </div>
      )}

      {!isLoading && !isError && games.length > 0 && (
        <div>
          <div
            aria-busy={isPlaceholderData}
            className="grid grid-cols-1 gap-6 transition-opacity duration-200 aria-busy:opacity-50 sm:grid-cols-2 lg:grid-cols-3"
          >
            {games.map((game, index) => (
              <GameSearchCard key={`${game.slug}-${index}`} game={game} />
            ))}
          </div>

          {isFetchingNextPage && (
            <SkeletonGroup
              label="Loading more games"
              className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <GameSearchCardSkeleton key={i} />
              ))}
            </SkeletonGroup>
          )}

          <div
            ref={ref}
            className="flex flex-col items-center justify-center py-8"
          >
            {!hasNextPage && (
              <p className="text-xs text-muted-foreground">
                You have reached the end of the results.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GamesResults
