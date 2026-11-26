import { Game } from "@/features/games/types"

export interface Platform {
  id: string
  slug: string
  name: string
}

export interface PlatformGamesPagination {
  platform: Platform
  items: Game[]
  total: number
  totalPages: number
  page: number
}
