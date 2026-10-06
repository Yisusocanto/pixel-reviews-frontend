import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Comment } from "@/features/comments/types"
import dayjs from "dayjs"
import Link from "next/link"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

interface Props {
  comment: Comment
  isAuthor?: boolean
}

function CommentCard({ comment, isAuthor = false }: Props) {
  const formatTimeAgo = (date: Date | string): string => {
    return dayjs(date).fromNow()
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarImage src={comment.user?.profilePhotoUrl} />
          <AvatarFallback className="text-[10px] uppercase">
            {comment.user?.username?.slice(0, 2) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
      </div>
      <p className="pl-8 text-sm leading-relaxed text-foreground/90">
        {comment.content}
      </p>
    </div>
  )
}

export default CommentCard
