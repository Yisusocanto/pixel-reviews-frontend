import { Skeleton } from "@/components/ui/skeleton"
import ModerationQueueSkeleton from "@/features/moderation/components/moderation-queue-skeleton"

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-60 sm:h-9" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl md:w-96" />
      </div>
      <ModerationQueueSkeleton />
    </div>
  )
}
