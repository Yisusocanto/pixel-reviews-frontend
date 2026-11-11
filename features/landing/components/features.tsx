"use client"

import { StarRating } from "@/components/ui/star-rating"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import NotchCard from "./notch-card"
import PixelAvatar from "./pixel-avatar"

const VERDICTS: Record<number, string> = {
  0: "Your call.",
  1: "Uninstalled.",
  2: "Mid at best.",
  3: "Solid. Not sacred.",
  4: "Stayed up for it.",
  5: "Perfect run.",
}

const SPREAD = [
  { stars: 5, share: 0.62 },
  { stars: 4, share: 0.88 },
  { stars: 3, share: 0.4 },
  { stars: 2, share: 0.16 },
  { stars: 1, share: 0.08 },
]

const THREAD = [
  { user: "nightcrawler_", text: "Boss two is not hard, it's rude." },
  {
    user: "mapa.fria",
    text: "Rude is the point. Finished it on my sixth try.",
  },
  { user: "ofelia64", text: "Counterpoint: the music carries every death." },
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

function RateCard() {
  const [value, setValue] = useState(0)
  const rounded = Math.round(value)

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-7"
    >
      <NotchCard
        className="h-full"
        innerClassName="flex flex-col justify-between gap-10 p-6 sm:p-8"
      >
        <div className="max-w-md">
          <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
            Review
          </span>
          <h3 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Score it, then back it up
          </h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Give a game one to five stars and write what you actually felt. Your
            review lives on the game page, so the next player reads you before
            they read a press score.
          </p>
        </div>

        <div className="bg-background p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Portal 2
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Try it
            </span>
          </div>
          <div className="mt-4">
            <StarRating size="lg" value={value} onValueChange={setValue} />
          </div>
          <div className="mt-5 h-12 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={rounded}
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "font-heading text-3xl font-black tracking-tight sm:text-4xl",
                  rounded === 0 ? "text-muted-foreground" : "text-primary"
                )}
              >
                {VERDICTS[rounded]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </NotchCard>
    </motion.div>
  )
}

function SpreadCard() {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-5"
    >
      <NotchCard
        className="h-full"
        innerClassName="flex flex-col justify-between gap-10 p-6 sm:p-8"
      >
        <div>
          <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
            Verdict
          </span>
          <h3 className="mt-3 font-heading text-3xl font-extrabold tracking-tight">
            See the whole spread
          </h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every game shows how players really scored it, from rage-quits to
            perfect runs. Not one flat average.
          </p>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.02 }}
          className="flex flex-col gap-2"
          aria-label="Sample rating distribution for Lanternfall"
        >
          {SPREAD.map((row) => {
            const filled = Math.round(row.share * 22)
            return (
              <li key={row.stars} className="flex items-center gap-3">
                <span className="w-6 font-mono text-xs text-muted-foreground">
                  {row.stars}★
                </span>
                <div className="flex flex-1 gap-0.75">
                  {Array.from({ length: 22 }, (_, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0.15, scale: 0.6 },
                        show: {
                          opacity: i < filled ? 1 : 0.15,
                          scale: 1,
                          transition: {
                            delay: i * 0.025 + (5 - row.stars) * 0.08,
                          },
                        },
                      }}
                      className={cn(
                        "aspect-square flex-1",
                        i < filled ? "bg-primary" : "bg-foreground"
                      )}
                    />
                  ))}
                </div>
              </li>
            )
          })}
        </motion.ul>
      </NotchCard>
    </motion.div>
  )
}

function RepliesCard() {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-12"
    >
      <NotchCard innerClassName="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
        <div className="max-w-md">
          <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
            Replies
          </span>
          <h3 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Disagree out loud
          </h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Comment on any review, like the takes that are right, wishlist what
            you haven&apos;t played yet. Every opinion has a username behind it.
          </p>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.45, delayChildren: 0.2 }}
          className="flex flex-col gap-3"
        >
          {THREAD.map((comment, index) => (
            <motion.li
              key={comment.user}
              variants={{
                hidden: { opacity: 0, x: -16 },
                show: { opacity: 1, x: 0 },
              }}
              className={cn(
                "flex items-start gap-3",
                index === 1 && "sm:ml-10"
              )}
            >
              <PixelAvatar seed={comment.user} />
              <div className="bg-background px-4 py-3">
                <span className="font-mono text-xs text-primary">
                  @{comment.user}
                </span>
                <p className="mt-1 text-sm leading-relaxed sm:text-base">
                  {comment.text}
                </p>
              </div>
            </motion.li>
          ))}
          <motion.li
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            className="flex items-center gap-3 sm:ml-5"
            aria-hidden
          >
            <span className="size-9 shrink-0 bg-secondary" />
            <span className="flex gap-1 bg-background px-4 py-4">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="landing-blink size-1.5 bg-muted-foreground"
                  style={{ animationDelay: `${dot * 0.25}s` }}
                />
              ))}
            </span>
          </motion.li>
        </motion.ul>
      </NotchCard>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-24 sm:px-8 sm:pt-36">
      <div className="mb-14 max-w-3xl">
        <span className="font-mono text-xs tracking-[0.25em] text-primary uppercase">
          The game goes on here
        </span>
        <h2 className="mt-4 font-heading text-4xl leading-[1.05] font-black tracking-tight sm:text-6xl">
          Five stars. Then say why.
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <RateCard />
        <SpreadCard />
        <RepliesCard />
      </div>
    </section>
  )
}
