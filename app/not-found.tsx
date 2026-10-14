import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PixelGamepadIcon } from "@/components/ui/pixel-gamepad-icon"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
          <PixelGamepadIcon className="h-16 w-32 text-primary" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Error 404
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Lost in the pixel realm?
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            The page, player profile, or game you are looking for does not exist
            or has been moved.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="primary">
            <Link href="/">
              <Home className="size-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">
              <Search className="size-4" />
              Explore Games
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
