import { Skeleton } from "@/components/ui/skeleton"

export default function UserSearchCardSkeleton() {
  return (
    <div className="flex items-center gap-4 border border-t-2 border-border/50 border-t-primary/40 bg-card/20 p-4">
      <Skeleton className="size-14 shrink-0 rounded-full bg-muted/40" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-2/5 rounded-none bg-muted-foreground/30" />
        <Skeleton className="h-3 w-4/5 rounded-none bg-muted/40" />
      </div>
    </div>
  )
}
