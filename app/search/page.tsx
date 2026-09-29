"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import GameSearchCard from "@/features/games/components/game-search-card"
import GameSearchCardSkeleton from "@/features/games/components/game-search-card-skeleton"
import { useSearchGames } from "@/features/games/hooks/use-games"
import {
  AlertCircle,
  Flame,
  Loader2,
  RefreshCw,
  Search,
  SearchX,
  X,
} from "lucide-react"
import { useState } from "react"
import { useDebounce } from "use-debounce"

function SearchPage() {
  const [title, setTitle] = useState("")
  const [gameTitle] = useDebounce(title, 400)

  const {
    data: games,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchGames(gameTitle)

  const isDebouncing = title !== gameTitle
  const showLoading = isLoading || isFetching
  const isSearchActive = gameTitle.trim().length > 0

  return (
    <div className="flex flex-1 flex-col bg-secondary px-6 sm:px-8 pb-12">
      {/* Search Input */}
      <div className="py-8">
        <div className="relative w-full max-w-3xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={title}
            placeholder="Search any game by title..."
            type="search"
            className="h-11 w-full rounded-lg border-border/60 bg-background/50 pl-10 pr-10 text-sm focus-visible:ring-primary [&::-webkit-search-cancel-button]:hidden"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {isDebouncing && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
            {title && (
              <button
                type="button"
                onClick={() => setTitle("")}
                className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Header Info: Popular Games or Search Results Count */}
      {!isError && (
        <div className="mb-6">
          {showLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {isSearchActive
                  ? `Searching games for "${gameTitle || title}"...`
                  : "Loading popular games..."}
              </span>
            </div>
          ) : isSearchActive ? (
            <p className="text-sm text-muted-foreground">
              Found{" "}
              <strong className="font-semibold text-primary">
                {games?.length ?? 0}
              </strong>{" "}
              {games?.length === 1 ? "result" : "results"} matching{" "}
              <strong className="text-foreground italic">
                &quot;{gameTitle}&quot;
              </strong>
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Flame className="size-5 text-primary" />
                <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
                  Popular Games
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Explore trending and top-rated games, or use the search bar above
                to find a specific title.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
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

      {/* Skeletons Loading Grid */}
      {showLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <GameSearchCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!showLoading && !isError && games && games.length === 0 && (
        <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/20 p-12 text-center">
          <div className="mb-3 rounded-full bg-muted/40 p-4 text-muted-foreground">
            <SearchX className="size-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            No games found
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t find any games matching{" "}
            <strong className="text-foreground">&quot;{gameTitle}&quot;</strong>.
            Try checking for typos or searching with different keywords.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTitle("")}
            className="mt-4"
          >
            View popular games
          </Button>
        </div>
      )}

      {/* Results Grid */}
      {!showLoading && !isError && games && games.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameSearchCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
