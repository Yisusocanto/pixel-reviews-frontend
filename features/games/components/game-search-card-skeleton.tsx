import { Skeleton } from "@/components/ui/skeleton"

export default function GameSearchCardSkeleton() {
  return (
    <div className="relative aspect-4/3 w-full overflow-hidden border border-t-2 border-border/50 border-t-primary/40 bg-card/20">
      <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-foreground/10" />
      <div className="absolute inset-0 z-5 bg-linear-to-t from-background/90 via-background/40 to-transparent" />
      <div className="absolute bottom-2 z-10 flex w-full items-center justify-between gap-3 px-3">
        <Skeleton className="h-6 w-3/5 rounded-none bg-foreground/15" />
        <Skeleton className="h-5 w-12 rounded-none bg-foreground/15" />
      </div>
    </div>
  )
}
