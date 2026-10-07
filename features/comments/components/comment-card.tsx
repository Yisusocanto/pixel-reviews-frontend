"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteComments } from "@/features/comments/hooks"
import { Comment } from "@/features/comments/types"
import { formatTimeAgo } from "@/lib/format-time"
import { Ellipsis, Trash } from "lucide-react"
import Link from "next/link"

interface Props {
  comment: Comment
  isAuthor?: boolean
}

function CommentCard({ comment, isAuthor = false }: Props) {
  const { mutate: deleteComment, isPending } = useDeleteComments()

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={comment.user?.profilePhotoUrl} />
          <AvatarFallback className="text-[10px] uppercase">
            {comment.user?.username?.slice(0, 2) ?? "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 items-center justify-between gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Link
              className="font-bold text-foreground transition-colors hover:text-primary"
              href={`/users/${comment.user?.username}`}
            >
              {comment.user?.username}
            </Link>
            {isAuthor && (
              <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary">
                you
              </span>
            )}
            <span>·</span>
            <span>{formatTimeAgo(comment.createdAt)}</span>
          </div>

          {isAuthor && (
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      className="size-6 text-muted-foreground hover:text-foreground"
                    >
                      <Ellipsis className="size-3.5" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      deleteComment({
                        commentId: comment.id,
                        reviewId: comment.reviewId,
                      })
                    }
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="size-4 text-destructive" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      <p className="pl-8 text-sm leading-relaxed text-foreground/90">
        {comment.content}
      </p>
    </div>
  )
}

export default CommentCard
