import { toast } from "@/components/ui/toast"
import {
  getUserGameWishlistAction,
  toggleWishlistAction,
} from "@/features/wishlists/actions"
import {
  InUserWishlist,
  ToggleWishlistRequest,
  WishlistPagination,
} from "@/features/wishlists/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useUserGameWishlist = (
  gameId: string,
  initialData?: InUserWishlist
) => {
  return useQuery({
    queryKey: ["userGameWishlist", gameId],
    queryFn: () => getUserGameWishlistAction(gameId),
    initialData,
    staleTime: 1000 * 60 * 5,
  })
}

export const useToggleWishlist = (gameId: string) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: ToggleWishlistRequest) => toggleWishlistAction(data),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["userGameWishlist", gameId] })
      await qc.cancelQueries({ queryKey: ["userWishlist"] })

      const previousInUserWishlist = qc.getQueryData<InUserWishlist>([
        "userGameWishlist",
        gameId,
      ])
      const previousUserWishlists = qc.getQueriesData<WishlistPagination>({
        queryKey: ["userWishlist"],
      })

      qc.setQueryData<InUserWishlist>(["userGameWishlist", gameId], (old) => ({
        inWishlist: !old?.inWishlist,
        wishlistId: old?.inWishlist ? null : old?.wishlistId,
      }))

      qc.setQueriesData<WishlistPagination>(
        { queryKey: ["userWishlist"] },
        (old) => {
          if (!old) return old
          const exists = old.items.some(
            (item) => item.gameId === gameId || item.game?.id === gameId
          )
          if (exists) {
            return {
              ...old,
              total: Math.max(0, old.total - 1),
              items: old.items.filter(
                (item) => item.gameId !== gameId && item.game?.id !== gameId
              ),
            }
          }
          return old
        }
      )

      return { previousInUserWishlist, previousUserWishlists }
    },
    onSuccess: (data) => {
      toast.add({
        description: data.inWishlist
          ? "Game added to your wishlist"
          : "Game removed from your wishlist",
        type: "success",
      })
    },
    onError: (error, _vars, context) => {
      if (context?.previousInUserWishlist) {
        qc.setQueryData(
          ["userGameWishlist", gameId],
          context.previousInUserWishlist
        )
      }
      if (context?.previousUserWishlists) {
        context.previousUserWishlists.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data)
        })
      }
      toast.add({
        description: `Failed to update wishlist: ${error.message}`,
        type: "error",
      })
    },
    onSettled: (data) => {
      if (data) {
        qc.setQueryData(["userGameWishlist", gameId], data)
      } else {
        qc.invalidateQueries({ queryKey: ["userGameWishlist", gameId] })
      }
      qc.invalidateQueries({ queryKey: ["userWishlist"] })
    },
  })
}
