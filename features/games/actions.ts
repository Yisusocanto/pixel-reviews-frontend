"use server"

import {
  Game,
  GamePagination,
  GameSearchPagination,
  GameStats,
} from "@/features/games/types"
import { ReviewPagination } from "@/features/reviews/types"
import { apiClient } from "@/lib/api/client"
import { AppLocale } from "@/lib/i18n/dictionaries"

export async function getGameAction(
  slug: string,
  lang: AppLocale = "en"
): Promise<Game> {
  const res = await apiClient<Game>(`/games/${slug}`, {
    params: { lang },
  })
  return res
}

export async function getAllGamesAction(
  page: number = 1,
  limit: number = 50
): Promise<GamePagination> {
  const res = await apiClient.get<GamePagination>("/games", {
    params: { page, limit },
  })
  return res
}

export async function getGameReviewsAction(
  gameSlug: string,
  page: number = 1,
  limit: number = 10
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
