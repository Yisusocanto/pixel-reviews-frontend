"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge-2"
import { Button } from "@/components/ui/button"
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton"
import DecisionButtons from "@/features/moderation/components/decision-buttons"
import { useCommentModerationHistory } from "@/features/moderation/hooks"
import { AdminModerationCommentItem } from "@/features/moderation/types"
import { formatModerationReason } from "@/features/reviews/components/review-moderation-notice"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Cpu,
  History,
  MessageSquare,
  ShieldAlert,
  UserCheck,
} from "lucide-react"
import Link from "next/link"

interface Props {
  item: AdminModerationCommentItem
}

function getJudgeInfo(judge: string) {
  switch (judge) {
    case "ai_model":
      return {
        label: "Gemini AI",
        icon: Bot,
        variant: "primary" as const,
      }
    case "rules":
      return {
        label: "Automated Rules",
        icon: Cpu,
        variant: "secondary" as const,
      }
    case "admin":
      return {
        label: "Human Moderator",
        icon: UserCheck,
        variant: "info" as const,
      }
    default:
      return {
        label: judge.replace(/_/g, " "),
        icon: ShieldAlert,
        variant: "outline" as const,
      }
  }
}

export function CommentModerationItem({ item }: Props) {
  const [showHistory, setShowHistory] = useState(false)
  const { data: history, isLoading: historyLoading } =
    useCommentModerationHistory(item.id, showHistory)

  const latest = item.latestModeration
  const judgeInfo = latest ? getJudgeInfo(latest.judge) : null
  const JudgeIcon = judgeInfo?.icon ?? ShieldAlert

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:p-6">
      <div className="flex flex-col gap-2.5 border-b border-border/60 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/games/${item.review.game.slug}`}
              className="truncate font-heading text-lg font-bold uppercase transition-colors hover:text-primary sm:text-xl"
            >
              {item.review.game.title}
            </Link>
            <Badge
              variant="info"
              appearance="light"
              size="sm"
              className="shrink-0 gap-1 text-xs"
            >
              <MessageSquare className="size-3" />
              Comment
            </Badge>
            <Badge variant="outline" size="sm" className="shrink-0 text-xs">
              v{item.contentVersion}
            </Badge>
            {item.isAppeal && (
              <Badge
                variant="warning"
                appearance="light"
                size="sm"
                className="shrink-0 text-xs"
              >
                User appeal
              </Badge>
            )}
            <Badge
              variant={
                item.moderationStatus === "approved"
                  ? "success"
                  : item.moderationStatus === "rejected"
                    ? "destructive"
                    : "secondary"
              }
              appearance="light"
              size="sm"
              className="shrink-0 text-xs capitalize"
            >
              {item.moderationStatus.replace(/_/g, " ")}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            Created {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
            {" · "}On review{" "}
            <span className="font-medium text-foreground/80">
              {item.review.title ? `"${item.review.title}"` : "(Untitled)"}
            </span>{" "}
            by{" "}
            <Link
              href={`/users/${item.review.user.username}`}
              className="font-medium text-foreground/80 hover:text-primary"
            >
              @{item.review.user.username}
            </Link>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-0.5 sm:pt-0">
          <Avatar className="size-6">
            <AvatarImage src={item.user.profilePhotoUrl ?? undefined} />
            <AvatarFallback className="text-[10px]">
              {item.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/users/${item.user.username}`}
            className="truncate text-xs font-semibold hover:text-primary sm:text-sm"
          >
            @{item.user.username}
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <p className="rounded-lg border border-border/40 bg-muted/20 p-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 sm:p-4">
          {item.content}
        </p>
      </div>

      {latest && (
        <div className="space-y-3 rounded-xl border border-border/80 bg-muted/30 p-3.5 sm:p-4">
          <div className="flex flex-col gap-1.5 border-b border-border/40 pb-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 shrink-0 text-primary" />
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Latest Evaluation
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {dayjs(latest.createdAt).format("DD/MM/YYYY · HH:mm")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-background/80 p-3">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Judge
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={judgeInfo?.variant}
                  appearance="light"
                  size="sm"
                  className="gap-1.5 font-medium"
                >
                  <JudgeIcon className="size-3.5" />
                  {judgeInfo?.label}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-background/80 p-3">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Violation Reason
              </span>
              <div className="flex items-center gap-2">
                {latest.reason ? (
                  <Badge
                    variant="destructive"
                    appearance="light"
                    size="sm"
                    className="text-xs"
                  >
                    {formatModerationReason(latest.reason)}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    None (Approved)
                  </span>
                )}
              </div>
            </div>
          </div>

          {latest.scores && Object.keys(latest.scores).length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Category Confidence
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(latest.scores).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background px-2.5 py-1 text-xs"
                  >
                    <span className="text-muted-foreground capitalize">
                      {k.replace(/_/g, " ")}:
                    </span>
                    <span
                      className={cn(
                        "font-mono font-semibold",
                        v >= 0.7
                          ? "text-destructive"
                          : v >= 0.4
                            ? "text-amber-500"
                            : "text-foreground/70"
                      )}
                    >
                      {(v * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {latest.note && (
            <div className="rounded-lg border border-border/40 bg-background/60 p-2.5 text-xs">
              <span className="mb-0.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Note
              </span>
              <p className="text-foreground/80 italic">
                &ldquo;{latest.note}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full justify-start text-xs text-muted-foreground hover:text-foreground sm:w-auto sm:justify-center"
        >
          <History className="mr-1.5 size-3.5" />
          {showHistory ? "Hide audit trail" : "Show audit trail"}
          {showHistory ? (
            <ChevronUp className="ml-1 size-3.5" />
          ) : (
            <ChevronDown className="ml-1 size-3.5" />
          )}
        </Button>

        <DecisionButtons item={item} entityType="comment" />
      </div>

      {showHistory && (
        <div className="mt-2 space-y-2 rounded-lg border border-border/80 bg-background/80 p-3 sm:p-4">
          <h5 className="font-heading text-xs font-bold text-primary uppercase">
            Audit Trail
          </h5>
          {historyLoading ? (
            <SkeletonGroup
              label="Loading history"
              className="flex flex-col gap-2"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </SkeletonGroup>
          ) : history && history.length > 0 ? (
            <div className="space-y-2.5">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col gap-1.5 border-b border-border/40 pb-2.5 text-xs last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold capitalize">
                      {h.judge} →{" "}
                      <span className="text-primary uppercase">
                        {h.verdict}
                      </span>{" "}
                      (v{h.contentVersion})
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {dayjs(h.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                  {h.reason && (
                    <span className="text-muted-foreground">
                      Reason:{" "}
                      <span className="font-mono text-destructive">
                        {formatModerationReason(h.reason)}
                      </span>
                    </span>
                  )}
                  {h.note && (
                    <span className="text-muted-foreground italic">
                      &ldquo;{h.note}&rdquo;
                    </span>
                  )}
                  {h.admin && (
                    <span className="text-[11px] text-muted-foreground">
                      Moderator: @{h.admin.username}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No prior moderation events.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentModerationItem
