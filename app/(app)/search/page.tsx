"use client"

import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GameSearchCardSkeleton from "@/features/games/components/game-search-card-skeleton"
import GamesResults from "@/features/games/components/games-results"
import UsersResults from "@/features/users/components/users-results"
import { Gamepad2, Loader2, Search, Users, X } from "lucide-react"
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <GameSearchCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function SearchPageContent() {
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
    <div className="flex flex-1 flex-col bg-secondary px-6 pb-12 sm:px-8">
      <div className="flex flex-col gap-4 py-8">
        <div className="relative w-full max-w-3xl">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={title}
            placeholder={
              type === "users"
                ? "Search users by username..."
                : "Search any game by title..."
            }
            type="search"
            className="h-11 w-full rounded-lg border-border/60 bg-background/50 pr-10 pl-10 text-sm focus-visible:ring-primary [&::-webkit-search-cancel-button]:hidden"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center gap-1.5">
            {isDebouncing && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
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
          <TabsList className="w-fit">
            <TabsTrigger value="games" className="gap-1.5 px-4">
              <Gamepad2 className="size-4" /> Games
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5 px-4">
              <Users className="size-4" /> Users
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {type === "users" ? (
        <UsersResults query={query} onClear={handleClear} />
      ) : (
        <GamesResults query={query} onClear={handleClear} />
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  )
}
