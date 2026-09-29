import {
  getGameReviewsAction,
  searchGamesAction,
} from "@/features/games/actions"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

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
  return useQuery({
    queryKey: ["searchGames", title],
    queryFn: () => searchGamesAction(title),
    enabled,
  })
}
