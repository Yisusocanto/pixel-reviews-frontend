"use client"

import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { useState } from "react"

interface Props {
  content?: string | null
  className?: string
}

function ExpandableText({ content, className }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!content) {
    return null
  }

  const isLong = content.length > 250

  return (
    <>
      <p
        className={cn(
          "leading-relaxed whitespace-pre-line text-muted-foreground antialiased",
          !isExpanded && "line-clamp-4",
          className
        )}
      >
        {content}
      </p>
      {isLong && (
        <Button
          variant={"ghost"}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-primary"
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </>
  )
}

export default ExpandableText
