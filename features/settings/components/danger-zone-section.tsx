"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { deleteAccountAction } from "@/features/users/actions"
import { User } from "@/features/users/types"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface Props {
  user: User
}

function DangerZoneSection({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [textConfirmation, setTextConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const textRequired = `delete ${user.username} account`
  const allowDeletion = textConfirmation.trim() === textRequired

  const handleOpenChange = (open: boolean) => {
    if (isDeleting) return
    setIsOpen(open)
    if (!open) {
      setTextConfirmation("")
      setErrorMessage("")
    }
  }

  const handleAccountDeletion = async () => {
    if (!allowDeletion || isDeleting) return

    setIsDeleting(true)
    setErrorMessage("")

    try {
      await deleteAccountAction()
      toast.add({
        type: "success",
        description: "Account deleted successfully",
      })
      await signOut({ redirectTo: "/" })
    } catch (error) {
      const err = error as Error
      const message = err.message || "Failed to delete account"
      setErrorMessage(message)
      toast.add({
        type: "error",
        description: message,
      })
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-destructive">Danger zone</h2>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-destructive">Delete account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Once your account is deleted, all your reviews, ratings, wishlist,
            and accumulated social history will be irreversibly lost. This
            action cannot be undone or restored under any circumstances.
          </p>
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button variant="destructive" />}>
              Delete account
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Field className="gap-2">
                  <FieldLabel className="block text-sm font-normal text-muted-foreground">
                    Type{" "}
                    <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground select-all">
                      {textRequired}
                    </code>{" "}
                    to confirm:
                  </FieldLabel>
                  <Input
                    value={textConfirmation}
                    onChange={(e) => setTextConfirmation(e.target.value)}
                    type="text"
                    disabled={isDeleting}
                    placeholder={textRequired}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </Field>
                {errorMessage && (
                  <p className="text-sm font-medium text-destructive">
                    {errorMessage}
                  </p>
                )}
              </div>
              <DialogFooter className="gap-2">
                <DialogClose
                  render={
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  }
                />
                <Button
                  onClick={handleAccountDeletion}
                  variant="destructive"
                  disabled={!allowDeletion || isDeleting}
                >
                  {isDeleting && <Spinner className="mr-2" />}
                  {isDeleting ? "Deleting..." : "Delete my account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

export default DangerZoneSection
