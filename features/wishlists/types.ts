import { Game } from "@/features/games/types"
import { User } from "@/features/users/types"

export interface Wishlist {
  id: string
  gameId: string
  userId: string
  game: Game
  user: User
}

export interface ToggleWishlistRequest {
  gameId: string
}

export interface InUserWishlist {
  inWishlist: boolean
  wishlistId?: string | null
}

export interface WishlistPagination {
  items: Wishlist[]
  total: number
  page: number
  totalPages: number
}
