"use server"

import {
  CreateReview,
  Review,
  ReviewPagination,
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
  console.log(res)
  return res
}

export async function createReviewAction(data: CreateReview): Promise<Review> {
  const res = await apiClient.post<Review>("/reviews", data)
  return res
}
