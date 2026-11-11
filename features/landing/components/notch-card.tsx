import { cn } from "@/lib/utils"

export default function NotchCard({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode
  className?: string
  innerClassName?: string
}) {
  return (
    <div className={cn("pixel-notch bg-foreground/15 p-px", className)}>
      <div className={cn("pixel-notch h-full bg-card", innerClassName)}>
        {children}
      </div>
    </div>
  )
}
