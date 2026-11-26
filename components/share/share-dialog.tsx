"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import {
  buildRedditShareUrl,
  buildWhatsAppShareUrl,
  buildXShareUrl,
  ShareCardFormat,
} from "@/lib/og-image-utils"
import { cn } from "@/lib/utils"
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Share2,
  Smartphone,
  Square,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export type ShareTarget =
  | {
      kind: "review"
      reviewId: string
      gameTitle: string
      score: number
      username?: string
      reviewTitle?: string
    }
  | {
      kind: "profile"
      username: string
    }

interface ShareDialogProps {
  target: ShareTarget
  trigger?: React.ReactElement | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  celebrationTitle?: string
}

export function ShareDialog({
  target,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  celebrationTitle,
}: ShareDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [format, setFormat] = useState<ShareCardFormat>("story")
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next)
    }
    externalOnOpenChange?.(next)
  }

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://www.pixelreviews.app"

  const permalinkPath =
    target.kind === "review"
      ? `/reviews/${target.reviewId}`
      : `/users/${target.username}`

  const permalinkUrl = `${origin}${permalinkPath}`

  const imageEndpoint =
    target.kind === "review"
      ? `/api/share/review/${target.reviewId}?format=${format}`
      : `/api/share/profile/${target.username}?format=${format}`

  const shareText =
    target.kind === "review"
      ? target.reviewTitle
        ? `${target.gameTitle} (${target.score}/5★): "${target.reviewTitle}" on Pixel Reviews`
        : `Rated ${target.gameTitle} ${target.score}/5★ on Pixel Reviews`
      : `Check out @${target.username}'s Top 4 games & Gamer DNA on Pixel Reviews`

  const filename =
    target.kind === "review"
      ? `pixel-reviews-${target.reviewId.slice(0, 8)}-${format}.png`
      : `pixel-reviews-${target.username}-${format}.png`

  const handleFormatSwitch = (nextFormat: ShareCardFormat) => {
    if (nextFormat === format) return
    setImageLoaded(false)
    setFormat(nextFormat)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(permalinkUrl)
      setCopied(true)
      toast.add({
        description: "Share link copied to clipboard",
        type: "success",
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.add({
        description: "Could not copy link",
        type: "error",
      })
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(imageEndpoint)
      if (!response.ok) {
        throw new Error("Failed to render card")
      }
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = blobUrl
      anchor.download = filename
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(blobUrl)
      toast.add({
        description: "Card downloaded — ready for Stories, TikTok or X!",
        type: "success",
      })
    } catch {
      toast.add({
        description: "Could not download the share card",
        type: "error",
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleNativeShare = async () => {
    setDownloading(true)
    try {
      const response = await fetch(imageEndpoint)
      const blob = await response.blob()
      const file = new File([blob], filename, { type: "image/png" })

      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Pixel Reviews",
          text: shareText,
          url: permalinkUrl,
          files: [file],
        })
        return
      }

      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "Pixel Reviews",
          text: shareText,
          url: permalinkUrl,
        })
        return
      }

      await handleDownload()
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return
      }
      await handleDownload()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger !== null && (
        <DialogTrigger
          render={
            trigger ?? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Share2 className="size-3.5" />
                <span>Share</span>
              </Button>
            )
          }
        />
      )}
      <DialogContent className="max-h-[92dvh] w-[calc(100%-1rem)] max-w-lg! overflow-y-auto border-t-2 border-t-primary p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {celebrationTitle ??
              (target.kind === "review"
                ? "Share Review Card"
                : `Share @${target.username}'s Gamer DNA`)}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Download a ready-to-post visual card for Instagram Stories, TikTok,
            X or Discord, or share the direct link.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-1">
          <button
            type="button"
            onClick={() => handleFormatSwitch("story")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
              format === "story"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Smartphone className="size-3.5" />
            <span>Story / TikTok (9:16)</span>
          </button>
          <button
            type="button"
            onClick={() => handleFormatSwitch("post")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
              format === "post"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Square className="size-3.5" />
            <span>Feed / X (4:5)</span>
          </button>
        </div>

        <div className="relative mx-auto flex w-full max-w-68 items-center justify-center overflow-hidden rounded-xl border border-border bg-zinc-950 shadow-xl">
          <div
            className={cn(
              "relative w-full",
              format === "story" ? "aspect-9/16" : "aspect-4/5"
            )}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950 text-xs text-muted-foreground">
                <Spinner className="size-5 text-primary" />
                <span>Rendering HD card...</span>
              </div>
            )}
            {open && (
              <Image
                key={imageEndpoint}
                src={imageEndpoint}
                alt="Share card preview"
                fill
                unoptimized
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "object-contain transition-opacity duration-200",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="gap-2"
          >
            {downloading ? (
              <Spinner className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            <span>Download PNG</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleNativeShare}
            disabled={downloading}
            className="gap-2"
          >
            <Share2 className="size-4" />
            <span>Quick Share</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-1.5 text-xs"
          >
            {copied ? (
              <Check className="size-3.5 text-primary" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <a
              href={buildXShareUrl(shareText, permalinkUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Post on X</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <a
              href={buildRedditShareUrl(shareText, permalinkUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Reddit</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <a
              href={buildWhatsAppShareUrl(shareText, permalinkUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>WhatsApp</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog
