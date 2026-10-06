import { createCommentAction } from "@/features/comments/actions"
import { CommentCreate } from "@/features/comments/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CommentCreate) => createCommentAction(data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["comments", data.reviewId] })
    },
  })
}
