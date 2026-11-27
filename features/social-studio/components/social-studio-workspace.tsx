"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  useGenerateSocialPack,
  useGenerateStudioTts,
  useSocialCandidates,
} from "@/features/social-studio/hooks"
import {
  SocialAngle,
  SocialCandidateItem,
  SocialContentPack,
  SocialLanguage,
  SocialSlide,
  StudioTtsResponse,
} from "@/features/social-studio/types"
import { cn } from "@/lib/utils"
import {
  Copy,
  Download,
  Layers,
  Mic,
  RefreshCw,
  Sparkles,
  Volume2,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

const ANGLES: {
  id: SocialAngle
  label: string
  hint: string
}[] = [
  {
    id: "critic_vs_players",
    label: "Crítica vs Jugadores",
    hint: "Debate entre nota de prensa y comunidad",
  },
  {
    id: "unfiltered_review",
    label: "Reseña Sin Filtro",
    hint: "Destaca opiniones picantes reales",
  },
  {
    id: "hidden_gems",
    label: "5 Joyas Ocultas",
    hint: "Nota alta pero pocos la jugaron",
  },
  {
    id: "most_anticipated",
    label: "Más Esperados",
    hint: "Top wishlists de la comunidad",
  },
]

const VOICES = [
  { id: "Orus", label: "Orus (Profunda / Editorial)" },
  { id: "Puck", label: "Puck (Ágil / Dinámica)" },
  { id: "Kore", label: "Kore (Clara / Narrativa)" },
  { id: "Charon", label: "Charon (Grave / Documental)" },
  { id: "Aoede", label: "Aoede (Expresiva / Cálida)" },
]

export default function SocialStudioWorkspace() {
  const [angle, setAngle] = useState<SocialAngle>("critic_vs_players")
  const [language, setLanguage] = useState<SocialLanguage>("es")
  const [editorialTone, setEditorialTone] = useState(
    "Afilado, apasionado, con criterio gamer e ironía sutil"
  )
  const [selectedCandidate, setSelectedCandidate] =
    useState<SocialCandidateItem | null>(null)
  const [pack, setPack] = useState<SocialContentPack | null>(null)
  const [activeSlideIdx, setActiveSlideIdx] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [renderingPreview, setRenderingPreview] = useState(false)
  const [downloadingAll, setDownloadingAll] = useState(false)

  const [voiceName, setVoiceName] = useState("Orus")
  const [ttsResult, setTtsResult] = useState<StudioTtsResponse | null>(null)

  const { data: candidatesData, isLoading: loadingCandidates } =
    useSocialCandidates(angle)
  const { mutate: generatePack, isPending: generatingPack } =
    useGenerateSocialPack()
  const { mutate: generateTts, isPending: generatingTts } =
    useGenerateStudioTts()

  const activeSlide: SocialSlide | undefined = pack?.slides[activeSlideIdx]

  const handleSelectAngle = (nextAngle: SocialAngle) => {
    setAngle(nextAngle)
    setSelectedCandidate(null)
  }

  useEffect(() => {
    if (!pack || !activeSlide) {
      return
    }

    let cancelled = false
    let objectUrlToRevoke: string | null = null

    const renderCurrentSlide = async () => {
      setRenderingPreview(true)
      try {
        const res = await fetch("/api/admin/social-slide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slide: activeSlide,
            slideIndex: activeSlideIdx,
            totalSlides: pack.slides.length,
            language: pack.language,
          }),
        })
        if (!res.ok) return
        const blob = await res.blob()
        if (cancelled) return
        objectUrlToRevoke = URL.createObjectURL(blob)
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return objectUrlToRevoke
        })
      } finally {
        if (!cancelled) {
          setRenderingPreview(false)
        }
      }
    }

    const timer = window.setTimeout(renderCurrentSlide, 220)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [pack, activeSlide, activeSlideIdx])

  const handleGeneratePack = () => {
    generatePack(
      {
        angle,
        language,
        editorialTone,
        gameSlug:
          selectedCandidate && !selectedCandidate.reviewId
            ? selectedCandidate.gameSlug
            : undefined,
        reviewId: selectedCandidate?.reviewId ?? undefined,
      },
      {
        onSuccess: (generated) => {
          setPack(generated)
          setActiveSlideIdx(0)
          setTtsResult(null)
        },
      }
    )
  }

  const handleSlideFieldChange = (
    field: keyof SocialSlide,
    value: string
  ) => {
    if (!pack) return
    const updatedSlides = pack.slides.map((item, idx) =>
      idx === activeSlideIdx ? { ...item, [field]: value } : item
    )
    setPack({ ...pack, slides: updatedSlides })
  }

  const handleDownloadCarousel = async () => {
    if (!pack) return
    setDownloadingAll(true)
    try {
      for (let idx = 0; idx < pack.slides.length; idx++) {
        const res = await fetch("/api/admin/social-slide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slide: pack.slides[idx],
            slideIndex: idx,
            totalSlides: pack.slides.length,
            language: pack.language,
          }),
        })
        if (!res.ok) throw new Error("Slide render failed")
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `${String(idx + 1).padStart(2, "0")}-${pack.slides[idx].kind}.png`
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(url)
      }
      toast.add({
        description: `Downloaded ${pack.slides.length} HD carousel slides (1080x1350)!`,
        type: "success",
      })
    } catch {
      toast.add({
        description: "Failed while exporting carousel slides",
        type: "error",
      })
    } finally {
      setDownloadingAll(false)
    }
  }

  const handleSynthesizeVoice = () => {
    if (!pack) return
    generateTts(
      {
        narration: pack.fullNarration,
        voiceDirection: pack.voiceDirection,
        voiceName,
      },
      {
        onSuccess: (res) => {
          setTtsResult(res)
        },
      }
    )
  }

  const handleDownloadVoiceover = () => {
    if (!ttsResult) return
    const anchor = document.createElement("a")
    anchor.href = ttsResult.audioDataUrl
    anchor.download = `pixel-voiceover-${ttsResult.voiceName.toLowerCase()}-${Date.now()}.wav`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  const handleCopyText = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value)
    toast.add({
      description: `${label} copied to clipboard`,
      type: "success",
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            <Sparkles className="size-3.5" />
            <span>Gemini AI + Studio TTS + Carousels</span>
          </span>
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
            Pixel Social Studio
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Generate ready-to-publish 1080×1350 carousels, studio voiceovers,
            and short-video scripts powered by real IGDB &amp; community data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-card p-1">
            {(["es", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "rounded-md px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors",
                  language === lang
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {lang === "es" ? "Español" : "English"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ANGLES.map((item) => {
          const active = angle === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectAngle(item.id)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border bg-card hover:border-foreground/25"
              )}
            >
              <span className="font-heading text-base font-bold">
                {item.label}
              </span>
              <span className="text-xs text-muted-foreground">{item.hint}</span>
            </button>
          )
        })}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              1. Select Target or Auto-Curate Top 5
            </h2>
            <p className="text-xs text-muted-foreground">
              Click a specific game/review below, or leave unselected to curate
              a multi-game pack automatically.
            </p>
          </div>
          {selectedCandidate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCandidate(null)}
            >
              Clear selection (Auto Top 5)
            </Button>
          )}
        </div>

        {loadingCandidates ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Spinner className="size-4 text-primary" />
            <span>Loading database candidates...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {candidatesData?.items.map((cand) => {
              const key = cand.reviewId ?? cand.gameId
              const isSelected =
                (selectedCandidate?.reviewId ?? selectedCandidate?.gameId) ===
                key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setSelectedCandidate(isSelected ? null : cand)
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border/70 bg-background/50 hover:border-foreground/25"
                  )}
                >
                  <div className="relative aspect-2/3 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    <Image
                      src={cand.coverUrl}
                      alt={cand.gameTitle}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {cand.gameTitle}
                    </p>
                    {cand.reviewTitle && (
                      <p className="truncate text-xs text-foreground/80">
                        “{cand.reviewTitle}”
                      </p>
                    )}
                    <p className="mt-0.5 font-mono text-[11px] text-primary">
                      {cand.summaryBadge}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <Separator className="my-5" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Editorial Direction for Gemini Pro
            </label>
            <Input
              value={editorialTone}
              onChange={(e) => setEditorialTone(e.target.value)}
              placeholder="Ej. Afilado, irónico con la prensa, ritmo rápido..."
            />
          </div>
          <Button
            type="button"
            size="lg"
            onClick={handleGeneratePack}
            disabled={generatingPack}
            className="gap-2"
          >
            {generatingPack ? (
              <Spinner className="size-4" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span>
              {generatingPack
                ? "Writing with Gemini Pro..."
                : "Generate Content Pack"}
            </span>
          </Button>
        </div>
      </section>

      {pack && (
        <>
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 lg:col-span-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                  <Layers className="size-3.5" />
                  <span>Carousel Preview (1080×1350)</span>
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleDownloadCarousel}
                  disabled={downloadingAll}
                  className="gap-1.5"
                >
                  {downloadingAll ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  <span>Download All ({pack.slides.length})</span>
                </Button>
              </div>

              <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-xl border border-border bg-zinc-950 shadow-xl">
                {renderingPreview && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/65 backdrop-blur-xs">
                    <Spinner className="size-6 text-primary" />
                  </div>
                )}
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Slide preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {pack.slides.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 font-mono text-xs font-bold transition-colors",
                      idx === activeSlideIdx
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {idx + 1}. {s.kind}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-7">
              {activeSlide && (
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <h3 className="font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                    Edit Slide {activeSlideIdx + 1} Live
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Eyebrow
                      </label>
                      <Input
                        value={activeSlide.eyebrow}
                        onChange={(e) =>
                          handleSlideFieldChange("eyebrow", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Badge
                      </label>
                      <Input
                        value={activeSlide.badge}
                        onChange={(e) =>
                          handleSlideFieldChange("badge", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Headline
                    </label>
                    <Input
                      value={activeSlide.headline}
                      onChange={(e) =>
                        handleSlideFieldChange("headline", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Body Copy
                    </label>
                    <Textarea
                      rows={3}
                      value={activeSlide.body}
                      onChange={(e) =>
                        handleSlideFieldChange("body", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                    <Mic className="size-3.5" />
                    <span>Short Narration Script &amp; Studio Voiceover</span>
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleCopyText("Narration script", pack.fullNarration)
                    }
                    className="gap-1.5"
                  >
                    <Copy className="size-3.5 text-primary" />
                    <span>Copy Script</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Studio Voice
                    </label>
                    <select
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {VOICES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Actor Voice Direction
                    </label>
                    <Input
                      value={pack.voiceDirection}
                      onChange={(e) =>
                        setPack({ ...pack, voiceDirection: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Full Short Narration Script
                  </label>
                  <Textarea
                    rows={4}
                    value={pack.fullNarration}
                    onChange={(e) =>
                      setPack({ ...pack, fullNarration: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    onClick={handleSynthesizeVoice}
                    disabled={generatingTts}
                    className="gap-2"
                  >
                    {generatingTts ? (
                      <Spinner className="size-4" />
                    ) : ttsResult ? (
                      <RefreshCw className="size-4" />
                    ) : (
                      <Volume2 className="size-4" />
                    )}
                    <span>
                      {generatingTts
                        ? "Synthesizing Studio Audio..."
                        : ttsResult
                          ? "Regenerate Voiceover"
                          : "Synthesize Gemini Pro Voiceover"}
                    </span>
                  </Button>

                  {ttsResult && (
                    <>
                      <audio
                        controls
                        src={ttsResult.audioDataUrl}
                        className="h-9 flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadVoiceover}
                        className="gap-1.5"
                      >
                        <Download className="size-3.5" />
                        <span>Download WAV</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h3 className="font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Ready-to-Post Captions (1-Click Copy)
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {(
                [
                  ["TikTok", pack.captions.tiktok],
                  ["Instagram", pack.captions.instagram],
                  ["X / Twitter", pack.captions.xPost],
                  ["YouTube Shorts", pack.captions.youtubeShorts],
                  [
                    "Reddit (Debate Post)",
                    `${pack.captions.redditTitle}\n\n${pack.captions.redditBody}`,
                  ],
                ] as const
              ).map(([network, text]) => (
                <div
                  key={network}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-border/80 bg-background/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold">
                      {network}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => handleCopyText(network, text)}
                      className="gap-1"
                    >
                      <Copy className="size-3" />
                      <span>Copy</span>
                    </Button>
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
