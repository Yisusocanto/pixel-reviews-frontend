export type SocialAngle =
  | "critic_vs_players"
  | "unfiltered_review"
  | "hidden_gems"
  | "most_anticipated"

export type SocialLanguage = "es" | "en"

export type SlideKind =
  | "hook"
  | "spotlight"
  | "comparison"
  | "quote"
  | "cta"

export interface SocialCandidateItem {
  angle: SocialAngle
  gameId: string
  gameSlug: string
  gameTitle: string
  coverUrl: string
  backdropUrl?: string | null
  criticScore?: number | null
  communityScore?: number | null
  totalReviews: number
  wishlistCount: number
  reviewId?: string | null
  reviewTitle?: string | null
  reviewExcerpt?: string | null
  reviewerUsername?: string | null
  summaryBadge: string
}

export interface SocialCandidatesResponse {
  angle: SocialAngle
  items: SocialCandidateItem[]
}

export interface SocialSlide {
  kind: SlideKind
  eyebrow: string
  headline: string
  body: string
  badge: string
  imageUrl?: string | null
  coverUrl?: string | null
  criticScore?: number | null
  communityScore?: number | null
  quoteAuthor?: string | null
}

export interface VideoScene {
  headline: string
  narration: string
  badge: string
  imageUrl?: string | null
  coverUrl?: string | null
  criticScore?: number | null
  communityScore?: number | null
  durationSeconds: number
}

export interface SocialCaptions {
  tiktok: string
  instagram: string
  xPost: string
  youtubeShorts: string
  redditTitle: string
  redditBody: string
}

export interface SocialGenerateRequest {
  angle: SocialAngle
  language: SocialLanguage
  gameSlug?: string | null
  reviewId?: string | null
  editorialTone?: string
}

export interface SocialContentPack {
  angle: SocialAngle
  language: SocialLanguage
  topicLabel: string
  hookHeadline: string
  hookSubheadline: string
  voiceDirection: string
  fullNarration: string
  slides: SocialSlide[]
  videoScenes: VideoScene[]
  captions: SocialCaptions
}

export interface StudioTtsRequest {
  narration: string
  voiceDirection: string
  voiceName?: string | null
}

export interface StudioTtsResponse {
  audioUrl?: string | null
  audioDataUrl: string
  durationSeconds: number
  voiceName: string
  model: string
}
