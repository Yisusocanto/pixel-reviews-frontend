import {
  getGameReviewsAction,
  searchGamesAction,
} from "@/features/games/actions"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useGameReviews = (gameSlug: string) => {
  return useInfiniteQuery({
    queryKey: ["gameReviews", gameSlug],
    queryFn: ({ pageParam }) => getGameReviewsAction(gameSlug, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
  })
}

export const useSearchGames = (title: string = "", enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ["searchGames", title],
    queryFn: ({ pageParam }) => searchGamesAction(title, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages && lastPage.items.length > 0) {
        return lastPage.page + 1
      }
      return undefined
    },
    enabled,
  })
}
