"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import ModerationItem from "@/features/moderation/components/moderation-item"
import { useModerationQueue } from "@/features/moderation/hooks"
import { ModerationStatus } from "@/features/reviews/types"
import { ChevronLeft, ChevronRight, Inbox, ShieldCheck } from "lucide-react"

export function ModerationQueue() {
  const [status, setStatus] = useState<ModerationStatus | "all">("needs_review")
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useModerationQueue(status, page, 10)

  const handleTabChange = (newStatus: ModerationStatus | "all") => {
    setStatus(newStatus)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight sm:text-3xl">
            Moderation Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and resolve flagged user reviews, suspicious content, and community appeals.
          </p>
        </div>

        <div className="flex w-full md:w-auto items-center overflow-x-auto no-scrollbar gap-1 rounded-xl border border-border bg-muted/30 p-1 text-xs">
          <Button
            size="sm"
            variant={status === "needs_review" ? "default" : "ghost"}
            onClick={() => handleTabChange("needs_review")}
            className="text-xs shrink-0"
          >
            Needs Review
          </Button>
          <Button
            size="sm"
            variant={status === "rejected" ? "default" : "ghost"}
            onClick={() => handleTabChange("rejected")}
            className="text-xs shrink-0"
          >
            Rejected
          </Button>
          <Button
            size="sm"
            variant={status === "approved" ? "default" : "ghost"}
            onClick={() => handleTabChange("approved")}
            className="text-xs shrink-0"
          >
            Approved
          </Button>
          <Button
            size="sm"
            variant={status === "pending" ? "default" : "ghost"}
            onClick={() => handleTabChange("pending")}
            className="text-xs shrink-0"
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={status === "all" ? "default" : "ghost"}
            onClick={() => handleTabChange("all")}
            className="text-xs shrink-0"
          >
            All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <Spinner />
          <p className="text-sm text-muted-foreground">Loading queue items...</p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          Error loading moderation items: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : data && data.items.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {data.items.length} of {data.total} review{data.total !== 1 ? "s" : ""}
            </span>
            <span>
              Page {data.page} of {Math.max(1, data.totalPages)}
            </span>
          </div>

          <div className="space-y-4">
            {data.items.map((item) => (
              <ModerationItem key={item.id} item={item} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4 mr-1" />
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/80 p-8 text-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            {status === "needs_review" ? (
              <ShieldCheck className="size-8" />
            ) : (
              <Inbox className="size-8" />
            )}
          </div>
          <h3 className="font-heading text-lg font-bold">
            {status === "needs_review" ? "Queue is clean!" : "No items found"}
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            {status === "needs_review"
              ? "All pending reviews have been processed. Great job!"
              : "No reviews currently match this filter criteria."}
          </p>
        </div>
      )}
    </div>
  )
}

export default ModerationQueue
