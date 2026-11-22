import { Game } from "@/features/games/types"
import { User } from "@/features/users/types"

export interface TopRatedGame {
  game: Game
  average: number
  count: number
}

export interface TopWantedGame {
  game: Game
  count: number
}

export interface TopReviewedGame {
  game: Game
  count: number
  lastWeek: number
}

export interface UserWithTheMostReviews {
  user: User
  count: number
  lastWeek: number
}

export interface TotalReviews {
  total: number
  lastWeek: number
}

export interface Statistics {
  topRatedGames: TopRatedGame[]
  topWantedGames: TopWantedGame[]
  topReviewedGames: TopReviewedGame[]
  topUsersWithTheMostReviews: UserWithTheMostReviews[]
  totalReviews: TotalReviews
}
