"use client"

import { useState } from "react"
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAppealComment } from "@/features/comments/hooks"
import { Comment } from "@/features/comments/types"
import { formatModerationReason } from "@/features/reviews/components/review-moderation-notice"
import { AlertTriangle, Clock } from "lucide-react"

interface Props {
  comment: Comment
  compact?: boolean
}

export function CommentModerationNotice({ comment, compact = false }: Props) {
  const { mutate: appealComment, isPending } = useAppealComment()
  const [appealedInSession, setAppealedInSession] = useState(false)

  const moderation = comment.moderation
  if (!moderation) return null

  if (
    appealedInSession ||
    (moderation.status === "needs_review" && Boolean(moderation.reason))
  ) {
    return (
      <Alert
        variant="warning"
        appearance="light"
        size="sm"
        className="border-warning/30 w-full min-w-0 items-start overflow-hidden rounded-lg border"
      >
        <AlertIcon className="text-warning mt-0.5 shrink-0">
          <Clock className="size-3.5" />
        </AlertIcon>
        <AlertContent className="min-w-0 flex-1 space-y-0.5">
          <AlertTitle className="text-xs font-semibold tracking-tight">
            Comment under manual verification
          </AlertTitle>
          <AlertDescription className="text-[11px] leading-relaxed wrap-break-word text-muted-foreground">
            Your appeal was received. A moderator will review your comment
            shortly.
          </AlertDescription>
        </AlertContent>
      </Alert>
    )
  }

  if (moderation.status !== "rejected") {
    return null
  }

  const friendlyReason = formatModerationReason(moderation.reason)

  const handleAppeal = () => {
    appealComment(comment.id, {
      onSuccess: () => {
        setAppealedInSession(true)
      },
    })
  }

  return (
    <Alert
      variant="destructive"
      appearance="light"
      size="sm"
      className="w-full min-w-0 items-start overflow-hidden rounded-lg border border-destructive/30"
    >
      <AlertIcon className="mt-0.5 shrink-0 text-destructive">
        <AlertTriangle className="size-3.5" />
      </AlertIcon>
      <AlertContent className="min-w-0 flex-1 space-y-2">
        <div className="space-y-0.5">
          <AlertTitle className="text-xs font-semibold tracking-tight wrap-break-word">
            Comment hidden from public ·{" "}
            <span className="font-medium opacity-90">{friendlyReason}</span>
          </AlertTitle>
          <AlertDescription className="text-[11px] leading-relaxed wrap-break-word text-muted-foreground">
            This comment was flagged by our moderation system and is currently
            visible only to you.
            {moderation.canAppeal
              ? " You can request a manual check if you believe this was a mistake."
              : ""}
          </AlertDescription>
        </div>

        {moderation.canAppeal && (
          <div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={handleAppeal}
              className={
                compact
                  ? "h-7 border-destructive/40 text-[11px] font-medium hover:bg-destructive/10"
                  : "h-7 w-full border-destructive/40 text-xs font-medium hover:bg-destructive/10 sm:w-auto"
              }
            >
              {isPending && <Spinner className="size-3" />}
              Request another review
            </Button>
          </div>
        )}
      </AlertContent>
    </Alert>
  )
}

export default CommentModerationNotice
