import { toast } from "@/components/ui/toast"
import { Game } from "@/features/games/types"
import {
  getUserFavGamesAction,
  getUserReviewsAction,
  getUserWishlistAction,
  searchUsersAction,
  updateUserFavGamesAction,
} from "@/features/users/actions"
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
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

export const useSearchUsers = (
  username: string = "",
  enabled: boolean = true,
  limit: number = 20
) => {
  return useInfiniteQuery({
    queryKey: ["searchUsers", username, limit],
    queryFn: ({ pageParam }) => searchUsersAction(username, pageParam, limit),
    initialPageParam: 1,
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

export const useUserFavGames = (username: string) => {
  return useQuery({
    queryKey: ["userFavGames", username],
    queryFn: () => getUserFavGamesAction(username),
  })
}

export const useUpdateUserFavGames = (username: string) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (slugs: Game["slug"][]) => updateUserFavGamesAction(slugs),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userFavGames", username] })
      toast.add({
        description: "Favorites list updated successfully",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({ description: error.message, type: "error" })
    },
  })
}
