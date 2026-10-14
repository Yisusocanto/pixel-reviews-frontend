import { cn } from "@/lib/utils"
import { PixelGamepadIcon } from "@/components/ui/pixel-gamepad-icon"
import Link from "next/link"

interface PixelReviewsLogoProps {
  showText?: boolean
  showTagline?: boolean
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
  iconClassName?: string
}

export function PixelReviewsLogo({
  showText = true,
  showTagline = true,
  size = "md",
  href,
  className,
  iconClassName,
}: PixelReviewsLogoProps) {
  const iconSizes = {
    sm: "h-5 w-10",
    md: "h-7 w-14",
    lg: "h-10 w-20",
  }

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <PixelGamepadIcon
        className={cn(iconSizes[size], "shrink-0 text-primary", iconClassName)}
      />
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline gap-1 font-extrabold tracking-tight">
            <span className="text-xl font-black tracking-wide text-primary">
              PIXEL
            </span>
            <span className="text-xl font-black tracking-wide text-foreground">
              REVIEWS
            </span>
          </div>
          {showTagline && (
            <span className="mt-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              For those who play
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center outline-none">
        {content}
      </Link>
    )
  }

  return content
}
