"use server"

import {
  InUserWishlist,
  ToggleWishlistRequest,
} from "@/features/wishlists/types"
import { apiClient } from "@/lib/api/client"

export async function toggleWishlistAction(
  data: ToggleWishlistRequest
): Promise<InUserWishlist> {
  const res = await apiClient.post<InUserWishlist>("/wishlists/toggle", data)
  return res
}

export async function getUserGameWishlistAction(
  gameId: string
): Promise<InUserWishlist> {
  try {
    const res = await apiClient.get<InUserWishlist>(`/wishlists/game/${gameId}`)
    return res
  } catch {
    return { inWishlist: false }
  }
}
