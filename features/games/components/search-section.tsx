"use client"

import { Input } from "@/components/ui/input"
import { SkeletonGroup } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GameSearchCardSkeleton from "@/features/games/components/game-search-card-skeleton"
import GamesResults from "@/features/games/components/games-results"
import { GameSearchPagination } from "@/features/games/types"
import UsersResults from "@/features/users/components/users-results"
import { Gamepad2, Search, Users, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { useDebounce } from "use-debounce"

type SearchType = "games" | "users"

function parseType(value: string | null): SearchType {
  return value === "users" ? "users" : "games"
}

function SearchPageFallback() {
  return (
    <div className="flex flex-1 flex-col bg-secondary px-6 pb-12 sm:px-8">
      <div className="py-8">
        <h1 className="mb-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Explore Games & Players
        </h1>
        <div className="relative w-full max-w-3xl">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games or users..."
            type="search"
            disabled
            className="h-11 w-full rounded-lg border-border/60 bg-background/50 pr-10 pl-10 text-sm focus-visible:ring-primary [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
      </div>
      <SkeletonGroup
        label="Loading games"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <GameSearchCardSkeleton key={i} />
        ))}
      </SkeletonGroup>
    </div>
  )
}

interface Props {
  initialPopularGames?: GameSearchPagination
}

function SearchPageContent({ initialPopularGames }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsRef = useRef(searchParams)

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  const type = parseType(searchParams.get("type"))

  const [title, setTitle] = useState(
    () => searchParams.get("q") ?? searchParams.get("title") ?? ""
  )

  const [debouncedTitle, { flush }] = useDebounce(title, 400)

  useEffect(() => {
    const currentParams = searchParamsRef.current
    const currentParam =
      currentParams.get("q") ?? currentParams.get("title") ?? ""
    const trimmed = debouncedTitle.trim()

    if (trimmed === currentParam) {
      return
    }

    const nextParams = new URLSearchParams(currentParams.toString())
    nextParams.delete("title")
    if (trimmed) {
      nextParams.set("q", trimmed)
    } else {
      nextParams.delete("q")
    }

    const queryString = nextParams.toString()
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(targetUrl, { scroll: false })
  }, [debouncedTitle, pathname, router])

  const handleClear = () => {
    setTitle("")
    flush()
    const nextParams = new URLSearchParams(searchParamsRef.current.toString())
    nextParams.delete("q")
    nextParams.delete("title")
    const queryString = nextParams.toString()
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(targetUrl, { scroll: false })
  }

  const handleTypeChange = (value: unknown) => {
    const nextType = parseType(String(value))
    const nextParams = new URLSearchParams(searchParamsRef.current.toString())
    nextParams.set("type", nextType)
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false })
  }

  const isDebouncing = title !== debouncedTitle
  const query = debouncedTitle.trim()

  return (
    <div className="flex flex-1 flex-col bg-secondary pb-12">
      <header className="relative isolate overflow-hidden border-b border-border/80 bg-background/60 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="app-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute -top-24 right-[-10%] -z-10 size-80 rounded-full bg-primary/12 blur-[100px]" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div>
            <span className="inline-block font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
              Catalog &amp; Players
            </span>
            <h1 className="mt-2 font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Explore Games &amp; Players
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Discover trending titles, read community ratings, or find fellow
              players.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-2xl">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={title}
                placeholder={
                  type === "users"
                    ? "Search users by username..."
                    : "Search any game by title..."
                }
                type="search"
                className="h-11 w-full rounded-lg border-border bg-card pr-10 pl-10 text-sm shadow-sm focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/25 [&::-webkit-search-cancel-button]:hidden"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center gap-1.5">
                {isDebouncing && <Spinner className="text-muted-foreground" />}
                {title && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            <Tabs value={type} onValueChange={handleTypeChange}>
              <TabsList className="w-fit border border-border bg-card">
                <TabsTrigger value="games" className="gap-1.5 px-4">
                  <Gamepad2 className="size-4" /> Games
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-1.5 px-4">
                  <Users className="size-4" /> Users
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-10">
        {type === "users" ? (
          <UsersResults query={query} onClear={handleClear} />
        ) : (
          <GamesResults
            query={query}
            onClear={handleClear}
            initialData={initialPopularGames}
          />
        )}
      </div>
    </div>
  )
}

export default function SearchSection({ initialPopularGames }: Props) {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent initialPopularGames={initialPopularGames} />
    </Suspense>
  )
}
