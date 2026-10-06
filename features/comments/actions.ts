"use server"

import {
  Comment,
  CommentCreate,
  CommentUpdate,
} from "@/features/comments/types"
import { apiClient } from "@/lib/api/client"

export async function createCommentAction(data: CommentCreate) {
  const res = await apiClient.post<Comment>("/comments", data)
  return res
}

export async function updateCommentAction(
  data: CommentUpdate,
  commentId: string
) {
  const res = await apiClient.patch<Comment>(`/comments/${commentId}`, data)
  return res
}

export async function deleteCommentAction(commentId: string) {
  const res = await apiClient.delete<Comment>(`/comments/${commentId}`)
  return res
}
