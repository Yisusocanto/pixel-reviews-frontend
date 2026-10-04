"use client"

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
import FileUpload from "@/components/ui/file-upload-05"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { uploadProfilePhotoAction } from "@/features/users/actions"
import { Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

interface Props {
  initialImageUrl?: string
  trigger?: React.ReactElement
}

function ProfilePhotoDialog({ initialImageUrl, trigger }: Props) {
  const [file, setFile] = useState<File | undefined>()
  const [open, setOpen] = useState<boolean>(false)
  const [serverError, setServerError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setFile(undefined)
      setServerError("")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)
    setServerError("")
    const data = new FormData()
    data.append("file", file)
    try {
      await uploadProfilePhotoAction(data)
      toast.add({
        description: "Profile photo updated successfully.",
        type: "success",
      })
      handleOpenChange(false)
      router.refresh()
    } catch (error) {
      const err = error as Error
      setServerError(err.message || "Failed to update profile photo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button
              type="button"
              size="icon-sm"
              className="size-8.5 rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-background transition-transform hover:scale-105 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
              title="Change profile photo"
            >
              <Camera className="size-4" />
              <span className="sr-only">Change profile photo</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Photo</DialogTitle>
          <DialogDescription>
            Upload and crop a new photo for your profile avatar.
          </DialogDescription>
        </DialogHeader>

        <FileUpload
          maxSizeMB={3}
          onFileSelect={(selectedFile) => {
            setFile(selectedFile)
            setServerError("")
          }}
          initialImageUrl={initialImageUrl}
          className="border-none bg-transparent p-0 shadow-none"
        />

        {serverError && (
          <p className="text-center text-xs font-semibold text-destructive">
            {serverError}
          </p>
        )}

        <DialogFooter className="gap-2">
          <DialogClose
            render={
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
            }
          />
          <Button
            onClick={handleUpload}
            disabled={isLoading || !file}
            type="button"
          >
            {isLoading && <Spinner className="mr-2" />}
            {isLoading ? "Saving..." : "Save Photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProfilePhotoDialog
