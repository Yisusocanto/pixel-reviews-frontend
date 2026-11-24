"use client"

import { useState } from "react"
import LoginModal from "@/components/auth/login-modal"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateReport } from "@/features/reports/hooks"
import { ReportTargetType, ReportType } from "@/features/reports/types"
import { cn } from "@/lib/utils"
import { Flag, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

interface ReportButtonProps {
  targetId: string
  targetType: ReportTargetType
  authorId?: string
  compact?: boolean
  className?: string
}

const REPORT_TYPES: {
  value: ReportType
  label: string
  description: string
}[] = [
  {
    value: "spam",
    label: "Spam or self-promotion",
    description: "Promotional links, repetitive text, or automated content",
  },
  {
    value: "spoiler",
    label: "Unmarked spoiler",
    description: "Plot twists, endings, or major story reveals without warning",
  },
  {
    value: "harassment",
    label: "Harassment or bullying",
    description: "Personal attacks, insults, or targeted intimidation",
  },
  {
    value: "hate_speech",
    label: "Hate speech",
    description: "Slurs, discrimination, or hateful content against groups",
  },
  {
    value: "inappropriate",
    label: "Inappropriate or NSFW",
    description: "Explicit sexual content, graphic violence, or disturbing media",
  },
  {
    value: "off_topic",
    label: "Off-topic or low effort",
    description: "Unrelated to the game or review, or meaningless filler",
  },
  {
    value: "other",
    label: "Other",
    description: "Any other violation of community guidelines",
  },
]

export function ReportButton({
  targetId,
  targetType,
  authorId,
  compact = false,
  className,
}: ReportButtonProps) {
  const { data: session } = useSession()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [reportType, setReportType] = useState<ReportType>("spam")
  const [reason, setReason] = useState("")
  const { mutate: createReport, isPending } = useCreateReport()

  if (session?.user?.id && authorId && session.user.id === authorId) {
    return null
  }

  const handleTriggerClick = () => {
    if (!session?.user) {
      setAuthModalOpen(true)
      return
    }
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createReport(
      {
        targetId,
        targetType,
        type: reportType,
        reason: reason.trim() || null,
      },
      {
        onSuccess: (res) => {
          if (res.ok || res.duplicate) {
            setDialogOpen(false)
            setReason("")
            setReportType("spam")
          }
        },
      }
    )
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={compact ? "icon" : "sm"}
        onClick={handleTriggerClick}
        aria-label={`Report ${targetType}`}
        className={cn(
          compact
            ? "size-6 text-muted-foreground hover:text-destructive"
            : "gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive",
          className
        )}
      >
        <Flag className={compact ? "size-3.5" : "size-3.5"} />
        {!compact && <span>Report</span>}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Report {targetType === "review" ? "Review" : "Comment"}
            </DialogTitle>
            <DialogDescription>
              Help us keep Pixel Reviews safe and spoiler-free. Select the
              reason that best describes the issue.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid max-h-60 gap-2 overflow-y-auto pr-1">
                {REPORT_TYPES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setReportType(option.value)}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-colors",
                      reportType === option.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/20 text-muted-foreground hover:border-border/80 hover:bg-muted/40"
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`report-reason-${targetId}`}>
                Additional details (optional)
              </Label>
              <Textarea
                id={`report-reason-${targetId}`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide any helpful context for moderators..."
                maxLength={500}
                rows={3}
              />
              <p className="text-right text-xs text-muted-foreground">
                {reason.length}/500
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="size-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <LoginModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="sign-in"
      />
    </>
  )
}

export default ReportButton
