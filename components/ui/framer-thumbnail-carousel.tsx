"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, animate } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface CarouselItem {
  id: number | string
  url: string
  title: string
}

export const items: CarouselItem[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    title: "Misty Mountain Majesty",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80",
    title: "Winter Wonderland",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    title: "Autumn Mountain Retreat",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    title: "Tranquil Lake Reflection",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    title: "Misty Mountain Peaks",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    title: "Golden Hour Glow",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80",
    title: "Snowy Mountain Highway",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    title: "Foggy Mountain Forest",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    title: "Sunset Mountain Silhouette",
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
    title: "Alpine Meadow Bliss",
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1439853941329-a99ce04a558a?auto=format&fit=crop&w=1200&q=80",
    title: "Mountain Lake Serenity",
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
    title: "Icy Mountain Stream",
  },
]

const FULL_WIDTH_PX = 120
const COLLAPSED_WIDTH_PX = 35
const GAP_PX = 2
const MARGIN_PX = 2

export interface FramerThumbnailCarouselProps {
  items?: CarouselItem[]
  className?: string
  initialIndex?: number
  onIndexChange?: (index: number) => void
}

export function Component({
  items: propItems = items,
  className = "",
  initialIndex = 0,
  onIndexChange,
}: FramerThumbnailCarouselProps = {}) {
  const [index, setIndex] = useState<number>(initialIndex)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const x = useMotionValue(0)

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex)
    onIndexChange?.(newIndex)
  }

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1
      const targetX = -index * containerWidth

      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      })
    }
  }, [index, x, isDragging])

  return (
    <div className={`mx-auto max-w-3xl ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Main Carousel */}
        <div className="relative overflow-hidden rounded-lg" ref={containerRef}>
          <motion.div
            className="flex"
            drag="x"
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false)
              const containerWidth = containerRef.current?.offsetWidth || 1
              const offset = info.offset.x
              const velocity = info.velocity.x

              let newIndex = index

              // If fast swipe, use velocity
              if (Math.abs(velocity) > 500) {
                newIndex = velocity > 0 ? index - 1 : index + 1
              }
              // Otherwise use offset threshold (30% of container width)
              else if (Math.abs(offset) > containerWidth * 0.3) {
                newIndex = offset > 0 ? index - 1 : index + 1
              }

              // Clamp index
              newIndex = Math.max(0, Math.min(propItems.length - 1, newIndex))
              handleIndexChange(newIndex)
            }}
            style={{ x }}
          >
            {propItems.map((item) => (
              <div
                key={item.id}
                className="h-64 w-full shrink-0 sm:h-80 md:h-[400px]"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="pointer-events-none h-full w-full rounded-lg object-cover select-none"
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.button
            type="button"
            aria-label="Previous slide"
            disabled={index === 0}
            onClick={() => handleIndexChange(Math.max(0, index - 1))}
            className={`absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-black shadow-lg transition-transform sm:left-4 sm:size-10 ${
              index === 0
                ? "cursor-not-allowed opacity-40"
                : "bg-white opacity-70 hover:scale-110 hover:opacity-100"
            }`}
          >
            <ChevronLeft className="size-4 text-black sm:size-6" />
          </motion.button>

          {/* Next Button */}
          <motion.button
            type="button"
            aria-label="Next slide"
            disabled={index === propItems.length - 1}
            onClick={() =>
              handleIndexChange(Math.min(propItems.length - 1, index + 1))
            }
            className={`absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-black shadow-lg transition-transform sm:right-4 sm:size-10 ${
              index === propItems.length - 1
                ? "cursor-not-allowed opacity-40"
                : "bg-white opacity-70 hover:scale-110 hover:opacity-100"
            }`}
          >
            <ChevronRight className="size-4 text-black sm:size-6" />
          </motion.button>
        </div>

        <Thumbnails
          items={propItems}
          index={index}
          setIndex={handleIndexChange}
        />
      </div>
    </div>
  )
}

function Thumbnails({
  items: thumbnailItems,
  index,
  setIndex,
}: {
  items: CarouselItem[]
  index: number
  setIndex: (index: number) => void
}) {
  const thumbnailsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (thumbnailsRef.current) {
      let scrollPosition = 0
      for (let i = 0; i < index; i++) {
        scrollPosition += COLLAPSED_WIDTH_PX + GAP_PX
      }

      scrollPosition += MARGIN_PX

      const containerWidth = thumbnailsRef.current.offsetWidth
      const centerOffset = containerWidth / 2 - FULL_WIDTH_PX / 2
      scrollPosition -= centerOffset

      thumbnailsRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [index])

  return (
    <div
      ref={thumbnailsRef}
      className="scrollbar-hide overflow-x-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex h-20 gap-1 pb-2" style={{ width: "fit-content" }}>
        {thumbnailItems.map((item, i) => (
          <motion.button
            type="button"
            key={item.id}
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? "active" : "inactive"}
            variants={{
              active: {
                width: FULL_WIDTH_PX,
                marginLeft: MARGIN_PX,
                marginRight: MARGIN_PX,
              },
              inactive: {
                width: COLLAPSED_WIDTH_PX,
                marginLeft: 0,
                marginRight: 0,
              },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative h-full shrink-0 overflow-hidden rounded"
          >
            <img
              src={item.url}
              alt={item.title}
              className="pointer-events-none h-full w-full object-cover select-none"
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export const FramerThumbnailCarousel = Component
export default Component
