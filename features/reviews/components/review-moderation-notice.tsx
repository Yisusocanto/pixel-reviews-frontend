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
import { useAppealReview } from "@/features/reviews/hooks"
import { Review } from "@/features/reviews/types"
import { AlertTriangle, Clock } from "lucide-react"

const FRIENDLY_REASONS: Record<string, string> = {
  hate_or_harassment: "Offensive language or harassment",
  self_harm_or_threat: "Sensitive content or threats of harm",
  spam_or_scam: "Spam, commercial promotion, or unrelated content",
  spam_links: "External or suspicious links",
  spam_repetitive: "Repetitive or low-effort text",
  excessive_caps: "Excessive use of capital letters",
  policy_violation: "Community guidelines violation",
}

export function formatModerationReason(reason?: string | null): string {
  if (!reason) return "Community guidelines violation"
  return FRIENDLY_REASONS[reason] ?? reason.replace(/_/g, " ")
}

interface Props {
  review: Review
  compact?: boolean
}

export function ReviewModerationNotice({ review, compact = false }: Props) {
  const { mutate: appealReview, isPending } = useAppealReview()
  const [appealedInSession, setAppealedInSession] = useState(false)

  const moderation = review.moderation
  if (!moderation) return null

  if (
    appealedInSession ||
    (moderation.status === "needs_review" && Boolean(moderation.reason))
  ) {
    return (
      <Alert
        variant="warning"
        appearance="light"
        size={compact ? "sm" : "md"}
        className="w-full min-w-0 items-start overflow-hidden rounded-xl border border-warning/30"
      >
        <AlertIcon className="mt-0.5 shrink-0 text-warning">
          <Clock className="size-4 sm:size-5" />
        </AlertIcon>
        <AlertContent className="min-w-0 flex-1 space-y-1">
          <AlertTitle className="text-xs sm:text-sm font-semibold tracking-tight">
            Review under manual verification
          </AlertTitle>
          <AlertDescription className="text-xs leading-relaxed text-muted-foreground break-words">
            Your appeal was received. A moderator will review your content
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
    appealReview(review.id, {
      onSuccess: () => {
        setAppealedInSession(true)
      },
    })
  }

  return (
    <Alert
      variant="destructive"
      appearance="light"
      size={compact ? "sm" : "md"}
      className="w-full min-w-0 items-start overflow-hidden rounded-xl border border-destructive/30"
    >
      <AlertIcon className="mt-0.5 shrink-0 text-destructive">
        <AlertTriangle className="size-4 sm:size-5" />
      </AlertIcon>
      <AlertContent className="min-w-0 flex-1 space-y-2.5">
        <div className="space-y-1">
          <AlertTitle className="text-xs sm:text-sm font-semibold tracking-tight break-words">
            Review hidden from public · <span className="font-medium opacity-90">{friendlyReason}</span>
          </AlertTitle>
          <AlertDescription className="text-xs leading-relaxed text-muted-foreground break-words">
            This review was flagged by our moderation system and is currently
            visible only to you. You can edit the text to comply with community
            guidelines
            {moderation.canAppeal
              ? " or request a manual check if you believe this was a mistake."
              : "."}
          </AlertDescription>
        </div>

        {moderation.canAppeal && !compact && (
          <div className="pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={handleAppeal}
              className="w-full sm:w-auto h-8 text-xs font-medium border-destructive/40 hover:bg-destructive/10"
            >
              {isPending && <Spinner />}
              Request another review
            </Button>
          </div>
        )}
      </AlertContent>
    </Alert>
  )
}

export default ReviewModerationNotice
