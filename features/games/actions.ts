"use server"

import {
  Game,
  GameSearchPagination,
  GameStats,
} from "@/features/games/types"
import { ReviewPagination } from "@/features/reviews/types"
import { apiClient } from "@/lib/api/client"

export async function getGameAction(slug: string): Promise<Game> {
  const res = await apiClient<Game>(`/games/${slug}`)
  return res
}

export async function getGameReviewsAction(
  gameSlug: string,
  page: number = 1,
  limit: number = 1
): Promise<ReviewPagination> {
  const res = await apiClient<ReviewPagination>(`/games/${gameSlug}/reviews`, {
    params: {
      page,
      limit,
    },
  })
  return res
}

export async function getGameStatsAction(gameSlug: string) {
  const res = await apiClient.get<GameStats>(`/games/${gameSlug}/stats`)
  return res
}

export async function searchGamesAction(
  title: string = "",
  page: number = 1,
  limit: number = 20
): Promise<GameSearchPagination> {
  const res = await apiClient.get<GameSearchPagination>("/games/search", {
    params: {
      title,
      page,
      limit,
    },
  })
  return res
}
