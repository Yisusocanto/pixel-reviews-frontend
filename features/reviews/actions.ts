"use server"

import {
  CreateReview,
  Review,
  ReviewPagination,
  UpdateReviewData,
} from "@/features/reviews/types"
import { apiClient } from "@/lib/api/client"

export async function getAllReviewsAction(
  page: number = 1,
  limit: number = 10
): Promise<ReviewPagination> {
  const res = await apiClient<ReviewPagination>("/reviews", {
    params: {
      page,
      limit,
    },
  })
  return res
}

export async function createReviewAction(data: CreateReview): Promise<Review> {
  const res = await apiClient.post<Review>("/reviews", data)
  return res
}

export async function updateReviewAction(
  id: string,
  data: UpdateReviewData
): Promise<Review> {
  const res = await apiClient.patch<Review>(`/reviews/${id}`, data)
  return res
}

export async function getUserGameReviewAction(
  gameId: string
): Promise<Review | null> {
  try {
    const res = await apiClient.get<Review>(`/reviews/user-review/${gameId}`)
    return res
  } catch {
    return null
  }
}

export async function deleteReviewAction(reviewId: string): Promise<Review> {
  const res = await apiClient.delete<Review>(`/reviews/${reviewId}`)
  return res
}
