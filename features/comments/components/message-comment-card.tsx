"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge-2"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message"
import { useDeleteComments } from "@/features/comments/hooks"
import { Comment } from "@/features/comments/types"
import { formatTimeAgo } from "@/lib/format-time"
import { Ellipsis, Trash } from "lucide-react"
import Link from "next/link"

interface Props {
  comment: Comment
  isAuthor: boolean
  isOwnComment: boolean
}

function MessageCommentCard({ comment, isAuthor, isOwnComment }: Props) {
  const { mutate: deleteComment } = useDeleteComments()

  return (
    <Message key={comment.id} align={isOwnComment ? "end" : "start"}>
      <MessageAvatar>
        <Avatar>
          <AvatarImage
            src={comment.user.profilePhotoUrl ?? undefined}
            alt={comment.user.username}
          />
          <AvatarFallback className="uppercase">
            {comment.user.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant={"secondary"}>
          <BubbleContent>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/users/${comment.user.username}`}
                  className="font-bold transition-colors hover:underline"
                >
                  {comment.user.username}
                </Link>
                {isAuthor && (
                  <Badge className="ml-1 h-fit w-fit bg-primary/30">
                    Author
                  </Badge>
                )}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </BubbleContent>
        </Bubble>
        <MessageFooter>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(comment.createdAt)}
          </span>
          {isOwnComment && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant={"ghost"}>
                    <Ellipsis />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => deleteComment(comment.id)}>
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </MessageFooter>
      </MessageContent>
    </Message>
  )
}

export default MessageCommentCard
