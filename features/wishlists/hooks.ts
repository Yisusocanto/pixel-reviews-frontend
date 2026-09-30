import { toast } from "@/components/ui/toast"
import {
  getUserGameWishlistAction,
  toggleWishlistAction,
} from "@/features/wishlists/actions"
import {
  InUserWishlist,
  ToggleWishlistRequest,
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

      const previousData = qc.getQueryData<InUserWishlist>([
        "userGameWishlist",
        gameId,
      ])

      qc.setQueryData<InUserWishlist>(["userGameWishlist", gameId], (old) => ({
        inWishlist: !old?.inWishlist,
        wishlistId: old?.inWishlist ? null : old?.wishlistId,
      }))

      return { previousData }
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
      if (context?.previousData) {
        qc.setQueryData(["userGameWishlist", gameId], context.previousData)
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
      qc.invalidateQueries({ queryKey: ["userWishlists"] })
    },
  })
}
