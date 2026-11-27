"use server"

import {
  SocialActionResult,
  SocialAngle,
  SocialCandidatesResponse,
  SocialContentPack,
  SocialGenerateRequest,
  StudioTtsRequest,
  StudioTtsResponse,
} from "@/features/social-studio/types"
import { ApiError, apiClient } from "@/lib/api/client"

function toActionError(
  error: unknown,
  fallbackMessage: string
): { ok: false; error: string; status?: number } {
  if (error instanceof ApiError) {
    return {
      ok: false,
      error: error.message || fallbackMessage,
      status: error.status,
    }
  }
  if (error instanceof Error && error.message) {
    return { ok: false, error: error.message }
  }
  return { ok: false, error: fallbackMessage }
}

export async function getSocialCandidatesAction(
  angle: SocialAngle,
  limit: number = 12
): Promise<SocialActionResult<SocialCandidatesResponse>> {
  try {
    const data = await apiClient.get<SocialCandidatesResponse>(
      "/admin/social/candidates",
      {
        params: { angle, limit },
      }
    )
    return { ok: true, data }
  } catch (error) {
    return toActionError(error, "Could not load social candidates")
  }
}

export async function generateSocialPackAction(
  data: SocialGenerateRequest
): Promise<SocialActionResult<SocialContentPack>> {
  try {
    const result = await apiClient.post<SocialContentPack>(
      "/admin/social/generate",
      data
    )
    return { ok: true, data: result }
  } catch (error) {
    return toActionError(error, "Could not generate social content pack")
  }
}

export async function generateStudioTtsAction(
  data: StudioTtsRequest
): Promise<SocialActionResult<StudioTtsResponse>> {
  try {
    const result = await apiClient.post<StudioTtsResponse>(
      "/admin/social/tts",
      data
    )
    return { ok: true, data: result }
  } catch (error) {
    return toActionError(error, "Could not synthesize studio voiceover")
  }
}
