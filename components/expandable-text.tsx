"use client"

import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { useState } from "react"

interface Props {
  content: string
}

function ExpandableText({ content }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isLong = content.length > 250

  return (
    <div>
      <p
        className={cn(
          "leading-relaxed text-muted-foreground antialiased",
          !isExpanded && "line-clamp-4"
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
    </div>
  )
}

export default ExpandableText
