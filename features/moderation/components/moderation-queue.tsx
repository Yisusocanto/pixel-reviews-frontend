"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CommentModerationItem from "@/features/moderation/components/comment-moderation-item"
import ModerationItem from "@/features/moderation/components/moderation-item"
import ModerationQueueSkeleton from "@/features/moderation/components/moderation-queue-skeleton"
import {
  useCommentModerationQueue,
  useModerationQueue,
} from "@/features/moderation/hooks"
import { ModerationEntityType } from "@/features/moderation/types"
import ReportModerationItem from "@/features/reports/components/report-moderation-item"
import { useReportModerationQueue } from "@/features/reports/hooks"
import { ReportStatus, ReportTargetType } from "@/features/reports/types"
import { ModerationStatus } from "@/features/reviews/types"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Flag,
  Inbox,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"

export function ModerationQueue() {
  const [entityType, setEntityType] = useState<ModerationEntityType>("reviews")
  const [status, setStatus] = useState<ModerationStatus | "all">("needs_review")
  const [reportStatus, setReportStatus] = useState<ReportStatus | "all">("open")
  const [reportTargetType, setReportTargetType] = useState<
    ReportTargetType | "all"
  >("all")
  const [page, setPage] = useState(1)

  const reviewsQuery = useModerationQueue(
    status,
    page,
    10,
    entityType === "reviews"
  )
  const commentsQuery = useCommentModerationQueue(
    status,
    page,
    10,
    entityType === "comments"
  )
  const reportsQuery = useReportModerationQueue(
    reportStatus,
    reportTargetType,
    page,
    10,
    entityType === "reports"
  )

  const activeQuery =
    entityType === "reviews"
      ? reviewsQuery
      : entityType === "comments"
        ? commentsQuery
        : reportsQuery
  const { isLoading, isError, error, isPlaceholderData } = activeQuery

  const handleEntityChange = (newEntity: ModerationEntityType) => {
    setEntityType(newEntity)
    setPage(1)
  }

  const handleTabChange = (newStatus: ModerationStatus | "all") => {
    setStatus(newStatus)
    setPage(1)
  }

  const handleReportStatusChange = (newStatus: ReportStatus | "all") => {
    setReportStatus(newStatus)
    setPage(1)
  }

  const handleReportTargetChange = (
    newTarget: ReportTargetType | "all"
  ) => {
    setReportTargetType(newTarget)
    setPage(1)
  }

  const total = activeQuery.data?.total ?? 0
  const totalPages = activeQuery.data?.totalPages ?? 0
  const currentPage = activeQuery.data?.page ?? page
  const itemCount = activeQuery.data?.items.length ?? 0
  const entityLabel =
    entityType === "reviews"
      ? "review"
      : entityType === "comments"
        ? "comment"
        : "report"
  const isCleanState =
    entityType === "reports"
      ? reportStatus === "open"
      : status === "needs_review"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-block font-mono text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              Administration
            </span>
            <h1 className="mt-1 font-heading text-2xl font-black tracking-tight sm:text-3xl">
              Moderation Queue
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and resolve flagged user reviews, comments, community
              reports, and appeals.
            </p>
          </div>

          <div className="flex w-full items-center gap-1 rounded-xl border border-border bg-muted/30 p-1 text-xs md:w-auto">
            <Button
              size="sm"
              variant={entityType === "reviews" ? "default" : "ghost"}
              onClick={() => handleEntityChange("reviews")}
              className="flex-1 gap-1.5 text-xs md:flex-initial"
            >
              <FileText className="size-3.5" />
              Reviews
            </Button>
            <Button
              size="sm"
              variant={entityType === "comments" ? "default" : "ghost"}
              onClick={() => handleEntityChange("comments")}
              className="flex-1 gap-1.5 text-xs md:flex-initial"
            >
              <MessageSquare className="size-3.5" />
              Comments
            </Button>
            <Button
              size="sm"
              variant={entityType === "reports" ? "default" : "ghost"}
              onClick={() => handleEntityChange("reports")}
              className="flex-1 gap-1.5 text-xs md:flex-initial"
            >
              <Flag className="size-3.5" />
              Reports
            </Button>
          </div>
        </div>

        {entityType === "reports" ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="no-scrollbar flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/30 p-1 text-xs sm:w-fit">
              <Button
                size="sm"
                variant={reportStatus === "open" ? "default" : "ghost"}
                onClick={() => handleReportStatusChange("open")}
                className="shrink-0 text-xs"
              >
                Open
              </Button>
              <Button
                size="sm"
                variant={reportStatus === "resolved" ? "default" : "ghost"}
                onClick={() => handleReportStatusChange("resolved")}
                className="shrink-0 text-xs"
              >
                Resolved
              </Button>
              <Button
                size="sm"
                variant={reportStatus === "dismissed" ? "default" : "ghost"}
                onClick={() => handleReportStatusChange("dismissed")}
                className="shrink-0 text-xs"
              >
                Dismissed
              </Button>
              <Button
                size="sm"
                variant={reportStatus === "all" ? "default" : "ghost"}
                onClick={() => handleReportStatusChange("all")}
                className="shrink-0 text-xs"
              >
                All
              </Button>
            </div>

            <div className="no-scrollbar flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/30 p-1 text-xs sm:w-fit">
              <Button
                size="sm"
                variant={reportTargetType === "all" ? "default" : "ghost"}
                onClick={() => handleReportTargetChange("all")}
                className="shrink-0 text-xs"
              >
                All Types
              </Button>
              <Button
                size="sm"
                variant={reportTargetType === "review" ? "default" : "ghost"}
                onClick={() => handleReportTargetChange("review")}
                className="shrink-0 text-xs"
              >
                Reviews
              </Button>
              <Button
                size="sm"
                variant={reportTargetType === "comment" ? "default" : "ghost"}
                onClick={() => handleReportTargetChange("comment")}
                className="shrink-0 text-xs"
              >
                Comments
              </Button>
            </div>
          </div>
        ) : (
          <div className="no-scrollbar flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/30 p-1 text-xs md:w-fit">
            <Button
              size="sm"
              variant={status === "needs_review" ? "default" : "ghost"}
              onClick={() => handleTabChange("needs_review")}
              className="shrink-0 text-xs"
            >
              Needs Review
            </Button>
            <Button
              size="sm"
              variant={status === "rejected" ? "default" : "ghost"}
              onClick={() => handleTabChange("rejected")}
              className="shrink-0 text-xs"
            >
              Rejected
            </Button>
            <Button
              size="sm"
              variant={status === "approved" ? "default" : "ghost"}
              onClick={() => handleTabChange("approved")}
              className="shrink-0 text-xs"
            >
              Approved
            </Button>
            <Button
              size="sm"
              variant={status === "pending" ? "default" : "ghost"}
              onClick={() => handleTabChange("pending")}
              className="shrink-0 text-xs"
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant={status === "all" ? "default" : "ghost"}
              onClick={() => handleTabChange("all")}
              className="shrink-0 text-xs"
            >
              All
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <ModerationQueueSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          Error loading moderation items:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : itemCount > 0 ? (
        <div
          aria-busy={isPlaceholderData}
          className="space-y-4 transition-opacity duration-200 aria-busy:opacity-50"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {itemCount} of {total} {entityLabel}
              {total !== 1 ? "s" : ""}
            </span>
            <span>
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
          </div>

          <div className="space-y-4">
            {entityType === "reviews"
              ? reviewsQuery.data?.items.map((item) => (
                  <ModerationItem key={item.id} item={item} />
                ))
              : entityType === "comments"
                ? commentsQuery.data?.items.map((item) => (
                    <CommentModerationItem key={item.id} item={item} />
                  ))
                : reportsQuery.data?.items.map((item) => (
                    <ReportModerationItem key={item.id} item={item} />
                  ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || isPlaceholderData}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages || isPlaceholderData}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-75 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/80 p-8 text-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            {isCleanState ? (
              <ShieldCheck className="size-8" />
            ) : (
              <Inbox className="size-8" />
            )}
          </div>
          <h3 className="font-heading text-lg font-bold">
            {isCleanState ? "Queue is clean!" : "No items found"}
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            {isCleanState
              ? `All pending ${entityLabel}s have been processed. Great job!`
              : `No ${entityLabel}s currently match this filter criteria.`}
          </p>
        </div>
      )}
    </div>
  )
}

export default ModerationQueue
