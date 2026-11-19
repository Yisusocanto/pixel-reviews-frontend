"use client"

import { Button } from "@/components/ui/button"
import { SkeletonGroup } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import UserSearchCard from "@/features/users/components/user-search-card"
import UserSearchCardSkeleton from "@/features/users/components/user-search-card-skeleton"
import { useSearchUsers } from "@/features/users/hooks"
import { AlertCircle, RefreshCw, SearchX, Users } from "lucide-react"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface Props {
  query: string
  onClear: () => void
}

function UsersResults({ query, onClear }: Props) {
  const isSearchActive = query.trim().length > 0

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
  } = useSearchUsers(query, isSearchActive)

  const { ref, inView } = useInView({ threshold: 0, rootMargin: "400px 0px" })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const users = data?.pages.flatMap((page) => page.items) ?? []
  const totalResults = data?.pages[0]?.total ?? users.length

  if (!isSearchActive) {
    return (
      <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/20 p-12 text-center">
        <div className="mb-3 rounded-full bg-muted/40 p-4 text-muted-foreground">
          <Users className="size-8" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">
          Find other players
        </h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Type a username in the search bar above to find people.
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
        <div className="mb-3 rounded-full bg-destructive/20 p-3 text-destructive">
          <AlertCircle className="size-8" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">
          Failed to load users
        </h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching users. Please try again."}
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
    )
  }

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-2" role="status">
          <Spinner className="text-primary" />
          <span className="text-sm text-muted-foreground">
            Searching users for &quot;{query}&quot;...
          </span>
        </div>
        <SkeletonGroup
          label="Loading users"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <UserSearchCardSkeleton key={i} />
          ))}
        </SkeletonGroup>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/20 p-12 text-center">
        <div className="mb-3 rounded-full bg-muted/40 p-4 text-muted-foreground">
          <SearchX className="size-8" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">
          No users found
        </h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          We couldn&apos;t find any users matching{" "}
          <strong className="text-foreground">&quot;{query}&quot;</strong>. Try
          checking for typos.
        </p>
        <Button variant="outline" size="sm" onClick={onClear} className="mt-4">
          Clear search
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Found{" "}
        <strong className="font-semibold text-primary">{totalResults}</strong>{" "}
        {totalResults === 1 ? "user" : "users"} matching{" "}
        <strong className="text-foreground italic">&quot;{query}&quot;</strong>
      </p>

      <div
        aria-busy={isPlaceholderData}
        className="grid grid-cols-1 gap-6 transition-opacity duration-200 aria-busy:opacity-50 sm:grid-cols-2 lg:grid-cols-3"
      >
        {users.map((user) => (
          <UserSearchCard key={user.username} user={user} />
        ))}
      </div>

      {isFetchingNextPage && (
        <SkeletonGroup
          label="Loading more users"
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <UserSearchCardSkeleton key={i} />
          ))}
        </SkeletonGroup>
      )}

      <div ref={ref} className="flex flex-col items-center justify-center py-8">
        {!hasNextPage && (
          <p className="text-xs text-muted-foreground">
            You have reached the end of the results.
          </p>
        )}
      </div>
    </div>
  )
}

export default UsersResults
