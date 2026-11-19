import { SkeletonGroup } from "@/components/ui/skeleton"
import ModerationItemSkeleton from "@/features/moderation/components/moderation-item-skeleton"

function ModerationQueueSkeleton({ count = 3 }: { count?: number }) {
  return (
    <SkeletonGroup label="Loading moderation queue" className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <ModerationItemSkeleton key={i} />
      ))}
    </SkeletonGroup>
  )
}

export default ModerationQueueSkeleton
