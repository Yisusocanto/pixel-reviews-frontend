"use server"

import {
  Platform,
  PlatformGamesPagination,
} from "@/features/platforms/types"
import { apiClient } from "@/lib/api/client"

export async function getPlatformsAction(): Promise<Platform[]> {
  return apiClient.get<Platform[]>("/platforms")
}

export async function getPlatformGamesAction(
  slug: string,
  page: number = 1,
  limit: number = 24
): Promise<PlatformGamesPagination> {
  return apiClient.get<PlatformGamesPagination>(`/platforms/${slug}/games`, {
    params: { page, limit },
  })
}
