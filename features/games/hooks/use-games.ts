import {
  getGameReviewsAction,
  searchGamesAction,
} from "@/features/games/actions"
import { GameSearchPagination } from "@/features/games/types"
import { ReviewPagination } from "@/features/reviews/types"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"

export const useGameReviews = (
  gameSlug: string,
  initialPage?: ReviewPagination
) => {
  return useInfiniteQuery({
    queryKey: ["gameReviews", gameSlug],
    queryFn: ({ pageParam }) => getGameReviewsAction(gameSlug, pageParam, 10),
    initialPageParam: 1,
    initialData: initialPage
      ? {
          pages: [initialPage],
          pageParams: [1],
        }
      : undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
  })
}

export const useSearchGames = (
  title: string = "",
  enabled: boolean = true,
  limit: number = 20,
  initialPage?: GameSearchPagination
) => {
  return useInfiniteQuery({
    queryKey: ["searchGames", title],
    queryFn: ({ pageParam }) => searchGamesAction(title, pageParam, limit),
    initialPageParam: 1,
    initialData:
      initialPage && title.trim() === ""
        ? {
            pages: [initialPage],
            pageParams: [1],
          }
        : undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages && lastPage.items.length > 0) {
        return lastPage.page + 1
      }
      return undefined
    },
    enabled,
    placeholderData: keepPreviousData,
  })
}
