"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge-2"
import { Button } from "@/components/ui/button"
import { useReportVerdict } from "@/features/reports/hooks"
import { AdminReportItem } from "@/features/reports/types"
import dayjs from "dayjs"
import {
  CheckCircle2,
  FileText,
  Flag,
  Loader2,
  MessageSquare,
  ShieldAlert,
  XCircle,
} from "lucide-react"
import Link from "next/link"

interface Props {
  item: AdminReportItem
}

export function ReportModerationItem({ item }: Props) {
  const { mutate: applyVerdict, isPending, variables } = useReportVerdict()

  const handleVerdict = (status: "resolved" | "dismissed") => {
    applyVerdict({
      reportId: item.id,
      payload: { status },
    })
  }

  const isResolving = isPending && variables?.payload.status === "resolved"
  const isDismissing = isPending && variables?.payload.status === "dismissed"

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:p-6">
      <div className="flex flex-col gap-2.5 border-b border-border/60 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            {item.target?.gameSlug && item.target?.gameTitle ? (
              <Link
                href={`/games/${item.target.gameSlug}`}
                className="truncate font-heading text-lg font-bold uppercase transition-colors hover:text-primary sm:text-xl"
              >
                {item.target.gameTitle}
              </Link>
            ) : (
              <span className="font-heading text-lg font-bold uppercase text-muted-foreground sm:text-xl">
                Reported {item.targetType}
              </span>
            )}

            <Badge
              variant="info"
              appearance="light"
              size="sm"
              className="shrink-0 gap-1 text-xs capitalize"
            >
              {item.targetType === "review" ? (
                <FileText className="size-3" />
              ) : (
                <MessageSquare className="size-3" />
              )}
              {item.targetType}
            </Badge>

            <Badge
              variant="warning"
              appearance="light"
              size="sm"
              className="shrink-0 gap-1 text-xs capitalize"
            >
              <Flag className="size-3" />
              {item.type.replace(/_/g, " ")}
            </Badge>

            <Badge
              variant={
                item.status === "resolved"
                  ? "destructive"
                  : item.status === "dismissed"
                    ? "success"
                    : "secondary"
              }
              appearance="light"
              size="sm"
              className="shrink-0 text-xs capitalize"
            >
              {item.status}
            </Badge>

            {item.openReportsCount > 1 && item.status === "open" && (
              <Badge
                variant="destructive"
                appearance="light"
                size="sm"
                className="shrink-0 text-xs"
              >
                {item.openReportsCount} open reports
              </Badge>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            Reported {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
            {item.target?.author && (
              <>
                {" · "}Content by{" "}
                <Link
                  href={`/users/${item.target.author.username}`}
                  className="font-medium text-foreground/80 hover:text-primary"
                >
                  @{item.target.author.username}
                </Link>
              </>
            )}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-0.5 sm:pt-0">
          <span className="text-xs text-muted-foreground">Reporter:</span>
          <Avatar className="size-6">
            <AvatarImage src={item.reporter.profilePhotoUrl ?? undefined} />
            <AvatarFallback className="text-[10px]">
              {item.reporter.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/users/${item.reporter.username}`}
            className="truncate text-xs font-semibold hover:text-primary sm:text-sm"
          >
            @{item.reporter.username}
          </Link>
        </div>
      </div>

      {item.reason && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs sm:text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground">
              Reporter note:
            </span>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {item.reason}
            </p>
          </div>
        </div>
      )}

      {item.target ? (
        <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {item.target.title && (
              <h3 className="text-sm font-bold text-foreground sm:text-base">
                {item.targetType === "comment"
                  ? `On review: "${item.target.title}"`
                  : item.target.title}
              </h3>
            )}
            <Badge
              variant={
                item.target.moderationStatus === "approved"
                  ? "success"
                  : item.target.moderationStatus === "rejected"
                    ? "destructive"
                    : "secondary"
              }
              appearance="light"
              size="sm"
              className="text-xs capitalize"
            >
              Content: {item.target.moderationStatus.replace(/_/g, " ")}
            </Badge>
          </div>
          {item.target.content ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
              {item.target.content}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No text content
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border/40 bg-muted/10 p-3 text-xs italic text-muted-foreground">
          The reported content has been deleted.
        </div>
      )}

      {item.status === "open" && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => handleVerdict("dismissed")}
            className="gap-1.5"
          >
            {isDismissing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4 text-emerald-500" />
            )}
            Dismiss & Keep Content
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={() => handleVerdict("resolved")}
            className="gap-1.5"
          >
            {isResolving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <XCircle className="size-4" />
            )}
            Resolve & Reject Content
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReportModerationItem
