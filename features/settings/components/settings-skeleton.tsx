import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton"

function CardSkeleton({ fields }: { fields: number }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-9 w-20" />
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <SkeletonGroup
      label="Loading settings"
      className="flex flex-col gap-4 p-4 sm:p-6 lg:p-8"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-10">
        <div className="flex-2">
          <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="size-20 rounded-full sm:size-24 md:size-28" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="flex-1">
          <CardSkeleton fields={2} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <div className="flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-card p-6">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </SkeletonGroup>
  )
}

export default SettingsSkeleton
