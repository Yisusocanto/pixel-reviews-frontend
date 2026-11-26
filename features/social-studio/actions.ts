"use server"

import {
  SocialAngle,
  SocialCandidatesResponse,
  SocialContentPack,
  SocialGenerateRequest,
  StudioTtsRequest,
  StudioTtsResponse,
} from "@/features/social-studio/types"
import { apiClient } from "@/lib/api/client"

export async function getSocialCandidatesAction(
  angle: SocialAngle,
  limit: number = 12
): Promise<SocialCandidatesResponse> {
  return apiClient.get<SocialCandidatesResponse>("/admin/social/candidates", {
    params: { angle, limit },
  })
}

export async function generateSocialPackAction(
  data: SocialGenerateRequest
): Promise<SocialContentPack> {
  return apiClient.post<SocialContentPack>("/admin/social/generate", data)
}

export async function generateStudioTtsAction(
  data: StudioTtsRequest
): Promise<StudioTtsResponse> {
  return apiClient.post<StudioTtsResponse>("/admin/social/tts", data)
}
