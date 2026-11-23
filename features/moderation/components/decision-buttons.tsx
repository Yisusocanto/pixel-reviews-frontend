"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  useCommentModerationDecision,
  useModerationDecision,
} from "@/features/moderation/hooks"
import { Check, X } from "lucide-react"

interface ModeratableItem {
  id: string
  contentVersion: number
  moderationReason?: string | null
}

interface Props {
  item: ModeratableItem
  entityType?: "review" | "comment"
}

export function DecisionButtons({ item, entityType = "review" }: Props) {
  const reviewMutation = useModerationDecision()
  const commentMutation = useCommentModerationDecision()
  const isPending =
    entityType === "comment"
      ? commentMutation.isPending
      : reviewMutation.isPending

  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState(
    item.moderationReason ?? "policy_violation"
  )
  const [note, setNote] = useState("")

  const formId = `reject-form-${entityType}-${item.id}`

  const handleApprove = () => {
    const payload = {
      decision: "approve" as const,
      version: item.contentVersion,
      note: "Approved by moderator",
    }
    if (entityType === "comment") {
      commentMutation.mutate({ commentId: item.id, payload })
    } else {
      reviewMutation.mutate({ reviewId: item.id, payload })
    }
  }

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      decision: "reject" as const,
      version: item.contentVersion,
      reason: reason || "policy_violation",
      note: note || undefined,
    }
    const onSuccess = (res: { ok: boolean }) => {
      if (res.ok) {
        setRejectOpen(false)
      }
    }

    if (entityType === "comment") {
      commentMutation.mutate({ commentId: item.id, payload }, { onSuccess })
    } else {
      reviewMutation.mutate({ reviewId: item.id, payload }, { onSuccess })
    }
  }

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <Button
        size="sm"
        variant="default"
        disabled={isPending}
        onClick={handleApprove}
        className="h-9 flex-1 bg-green-600 text-xs font-medium text-white hover:bg-green-700 sm:flex-initial sm:text-sm"
      >
        {isPending ? <Spinner /> : <Check className="mr-1.5 size-4" />}
        Approve
      </Button>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger
          render={
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              className="h-9 flex-1 text-xs font-medium sm:flex-initial sm:text-sm"
            >
              <X className="mr-1.5 size-4" />
              Reject
            </Button>
          }
        />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject {entityType}</DialogTitle>
            <DialogDescription>
              Provide a reason and an optional internal note for this decision.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleRejectConfirm}
            id={formId}
            className="space-y-4"
          >
            <FieldGroup>
              <Field>
                <FieldLabel>Violation reason</FieldLabel>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. hate_or_harassment, spam_links"
                />
              </Field>

              <Field>
                <FieldLabel>Internal moderator note (optional)</FieldLabel>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Explain why this content violates community rules..."
                />
              </Field>
            </FieldGroup>
          </form>

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <DialogClose
              render={
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              }
            />
            <Button
              form={formId}
              type="submit"
              variant="destructive"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending && <Spinner />}
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DecisionButtons
