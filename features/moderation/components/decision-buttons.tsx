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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useModerationDecision } from "@/features/moderation/hooks"
import { AdminModerationReviewItem } from "@/features/moderation/types"
import { Check, X } from "lucide-react"

interface Props {
  item: AdminModerationReviewItem
}

export function DecisionButtons({ item }: Props) {
  const { mutate: submitDecision, isPending } = useModerationDecision()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState(item.moderationReason ?? "policy_violation")
  const [note, setNote] = useState("")

  const handleApprove = () => {
    submitDecision({
      reviewId: item.id,
      payload: {
        decision: "approve",
        version: item.contentVersion,
        note: "Approved by moderator",
      },
    })
  }

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    submitDecision(
      {
        reviewId: item.id,
        payload: {
          decision: "reject",
          version: item.contentVersion,
          reason: reason || "policy_violation",
          note: note || undefined,
        },
      },
      {
        onSuccess: (res) => {
          if (res.ok) {
            setRejectOpen(false)
          }
        },
      }
    )
  }

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Button
        size="sm"
        variant="default"
        disabled={isPending}
        onClick={handleApprove}
        className="flex-1 sm:flex-initial h-9 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium"
      >
        {isPending ? <Spinner /> : <Check className="size-4 mr-1.5" />}
        Approve
      </Button>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger
          render={
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              className="flex-1 sm:flex-initial h-9 text-xs sm:text-sm font-medium"
            >
              <X className="size-4 mr-1.5" />
              Reject
            </Button>
          }
        />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject review</DialogTitle>
            <DialogDescription>
              Provide a reason and an optional internal note for this decision.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRejectConfirm} id="reject-form" className="space-y-4">
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

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <DialogClose render={<Button variant="outline" className="w-full sm:w-auto">Cancel</Button>} />
            <Button
              form="reject-form"
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
