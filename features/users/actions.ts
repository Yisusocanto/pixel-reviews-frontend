"use server"

import { revalidatePath } from "next/cache"
import { ReviewPagination } from "@/features/reviews/types"
import { User, UserStats, UserUpdate } from "@/features/users/types"
import { WishlistPagination } from "@/features/wishlists/types"
import { apiClient } from "@/lib/api/client"

export async function getUserAction(username: string) {
  const res = await apiClient.get<User>(`/users/${username}`)
  return res
}

export async function updateUserAction(data: UserUpdate) {
  const res = await apiClient.patch<User>("/users", data)
  revalidatePath(`/users/${res.username}`)
  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return res
}
export async function updateUserPasswordAction(
  oldPassword: string,
  newPassword: string
) {
  const res = await apiClient.patch<User>("/users/update-password", {
    oldPassword,
    newPassword,
  })
  return res
}

export async function getUserStatsAction(username: string) {
  const res = apiClient.get<UserStats>(`/users/${username}/stats`)
  return res
}

export async function getUserReviewsAction(
  username: string,
  page: number = 1,
  limit: number = 10
) {
  const res = apiClient.get<ReviewPagination>(`/users/${username}/reviews`, {
    params: {
      page,
      limit,
    },
  })
  return res
}

export async function getUserWishlistAction(
  username: string,
  page: number = 1,
  limit: number = 4
) {
  const res = await apiClient.get<WishlistPagination>(
    `/users/${username}/wishlist`,
    {
      params: {
        page,
        limit,
      },
    }
  )
  return res
}

export async function uploadProfilePhotoAction(formData: FormData) {
  const res = await apiClient.post<User>("/users/profile-photo", formData)
  revalidatePath(`/users/${res.username}`)
  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return res
}

export async function forgotPasswordAction(email: string) {
  const res = await apiClient.post<{ message: string }>(
    "/users/forgot-password",
    {
      email,
    }
  )
  return res
}

export async function resetPasswordAction(token: string, newPassword: string) {
  const res = await apiClient.post<{ message: string }>(
    "/users/reset-password",
    {
      token,
      newPassword,
    }
  )
  return res
}
