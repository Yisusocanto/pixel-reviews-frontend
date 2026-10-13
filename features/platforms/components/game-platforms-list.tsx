import { Platform } from "@/features/platforms/types"
import { PlatformIcon } from "./platform-icon"
import { cn } from "@/lib/utils"

interface Props {
  platforms: Platform[]
  className?: string
}

export function GamePlatformsList({ platforms, className }: Props) {
  if (!platforms || platforms.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {platforms.map((platform) => (
        <span
          key={platform.slug || platform.id}
          className="group inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/70 px-3 py-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-xs"
        >
          <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:text-primary">
            <PlatformIcon slug={platform.slug} name={platform.name} className="size-3.5" />
          </span>
          <span>{platform.name}</span>
        </span>
      ))}
    </div>
  )
}
