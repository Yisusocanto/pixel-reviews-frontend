"use server"

import { Genre, GenreGamesPagination } from "@/features/genres/types"
import { apiClient } from "@/lib/api/client"

export async function getGenresAction(): Promise<Genre[]> {
  return apiClient.get<Genre[]>("/genres")
}

export async function getGenreGamesAction(
  slug: string,
  page: number = 1,
  limit: number = 24
): Promise<GenreGamesPagination> {
  return apiClient.get<GenreGamesPagination>(`/genres/${slug}/games`, {
    params: { page, limit },
  })
}
