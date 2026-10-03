import {
  getUserReviewsAction,
  getUserWishlistAction,
} from "@/features/users/actions"
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export const useUserReviews = (username: string) => {
  return useInfiniteQuery({
    queryKey: ["userReviews", username],
    queryFn: ({ pageParam }) => getUserReviewsAction(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }

      return undefined
    },
  })
}

export const useUserWishlist = (
  username: string,
  page: number = 1,
  limit: number = 4
) => {
  return useQuery({
    queryKey: ["userWishlist", username, page, limit],
    queryFn: () => getUserWishlistAction(username, page, limit),
    placeholderData: keepPreviousData,
  })
}
