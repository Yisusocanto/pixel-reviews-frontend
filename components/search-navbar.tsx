"use client"

import { Input } from "@/components/ui/input"
import { useSearchGames } from "@/features/games/hooks/use-games"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import {
  AlertCircle,
  ArrowRight,
  Gamepad2,
  Loader2,
  Search,
  SearchX,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { useDebounce } from "use-debounce"

function getScoreBadgeColor(score: number | null | undefined) {
  if (score === null || score === undefined) return ""
  if (score >= 75) {
    return "border-emerald-500/40 bg-emerald-950/85 text-emerald-300"
  }
  if (score >= 50) {
    return "border-amber-500/40 bg-amber-950/85 text-amber-300"
  }
  return "border-rose-500/40 bg-rose-950/85 text-rose-300"
}

function SearchNavbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [debouncedTitle] = useDebounce(title, 350)

  const trimmedQuery = debouncedTitle.trim()
  const hasInput = title.trim().length > 0
  const isDebouncing = title.trim() !== trimmedQuery

  const { data, isLoading, isError } = useSearchGames(
    trimmedQuery,
    trimmedQuery.length > 0,
    5
  )

  const games = data?.pages.flatMap((page) => page.items) ?? []
  const totalResults = data?.pages[0]?.total ?? games.length
  const showLoading = isLoading || isDebouncing

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClear = () => {
    setTitle("")
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      e.currentTarget.blur()
    } else if (e.key === "Enter" && title.trim()) {
      setIsOpen(false)
      e.currentTarget.blur()
      router.push(`/search?q=${encodeURIComponent(title.trim())}`)
    }
  }

  return (
    <div className="relative w-full max-w-md flex-1" ref={ref}>
      <div className="group relative flex items-center">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          value={title}
          placeholder="Search games..."
          type="text"
          onChange={(e) => {
            setTitle(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-9 w-full rounded-lg border-border/60 bg-background/60 pr-9 pl-9 text-sm transition-all focus-visible:border-primary/60 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
        />
        <div className="absolute right-2.5 flex items-center gap-1">
          {hasInput && showLoading && (
            <Loader2 className="size-3.5 animate-spin text-primary" />
          )}
          {title && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {isOpen && hasInput && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-border/80 bg-popover/95 text-popover-foreground shadow-2xl ring-1 ring-black/20 backdrop-blur-md">
          {showLoading && games.length === 0 ? (
            <div className="flex flex-col gap-1 p-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg p-2"
                >
                  <div className="h-11 w-16 shrink-0 animate-pulse rounded-md bg-muted/60" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted/60" />
                    <div className="h-2.5 w-12 animate-pulse rounded bg-muted/40" />
                  </div>
                  <div className="h-5 w-7 shrink-0 animate-pulse rounded bg-muted/50" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-6 text-center">
              <AlertCircle className="size-5 text-destructive" />
              <p className="text-xs font-medium text-foreground">
                Could not load search results
              </p>
              <p className="text-[11px] text-muted-foreground">
                Please try again in a moment.
              </p>
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-6 text-center">
              <div className="rounded-full bg-muted/50 p-2 text-muted-foreground">
                <SearchX className="size-4" />
              </div>
              <p className="text-xs font-medium text-foreground">
                No games found for &quot;{trimmedQuery}&quot;
              </p>
              <p className="text-[11px] text-muted-foreground">
                Try another title or keyword.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-0.5 p-1.5">
                {games.map((game) => {
                  const coverImage = game.imageUrl || game.backgroundImage
                  const releaseYear =
                    game.releaseDate && dayjs(game.releaseDate).isValid()
                      ? dayjs(game.releaseDate).format("YYYY")
                      : null

                  return (
                    <Link
                      key={game.slug}
                      href={`/games/${game.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-accent/80"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted/30">
                          {coverImage ? (
                            <Image
                              src={coverImage}
                              fill
                              sizes="64px"
                              alt={game.title || "Game cover"}
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                              <Gamepad2 className="size-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="truncate font-heading text-xs font-bold tracking-wide text-foreground uppercase transition-colors group-hover:text-primary sm:text-sm">
                            {game.title}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {releaseYear ?? "TBA"}
                          </span>
                        </div>
                      </div>

                      {game.criticScore !== null &&
                        game.criticScore !== undefined && (
                          <span
                            className={cn(
                              "shrink-0 border px-1.5 py-0.5 font-mono text-xs font-bold",
                              getScoreBadgeColor(game.criticScore)
                            )}
                          >
                            {game.criticScore}
                          </span>
                        )}
                    </Link>
                  )
                })}
              </div>

              <div className="border-t border-border/60 bg-muted/20 p-1.5">
                <Link
                  href={`/search?q=${encodeURIComponent(trimmedQuery)}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                >
                  <span className="truncate">
                    View all results
                    {totalResults > 0 ? ` (${totalResults})` : ""}
                  </span>
                  <ArrowRight className="size-3.5 shrink-0" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchNavbar
