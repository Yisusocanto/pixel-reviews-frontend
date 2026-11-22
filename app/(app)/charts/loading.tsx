import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChartsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 sm:gap-10 sm:p-6 lg:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="flex items-end gap-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-2 border-l border-border/70 pl-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-52" />
            </div>
            <Card className="py-3">
              <CardContent className="space-y-3 px-4">
                {Array.from({ length: 5 }).map((_, row) => (
                  <div key={row} className="flex items-center gap-3 py-1">
                    <Skeleton className="h-6 w-7 shrink-0" />
                    <Skeleton className="aspect-3/4 w-12 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-20 shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-44" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-3xl border border-border bg-card p-4"
            >
              <Skeleton className="aspect-3/4 w-16 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
