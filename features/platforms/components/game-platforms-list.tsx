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
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {platforms.map((platform) => (
        <span
          key={platform.slug || platform.id}
          className="group inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/60 px-2.5 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
        >
          <span className="flex size-3.5 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:text-primary">
            <PlatformIcon
              slug={platform.slug}
              name={platform.name}
              className="size-3.5"
            />
          </span>
          <span>{platform.name}</span>
        </span>
      ))}
    </div>
  )
}
