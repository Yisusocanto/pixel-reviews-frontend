import { Game } from "@/features/games/types"

export interface Genre {
  id: string
  slug: string
  name: string
}

export interface GenreGamesPagination {
  genre: Genre
  items: Game[]
  total: number
  totalPages: number
  page: number
}
