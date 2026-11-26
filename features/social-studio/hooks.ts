import { toast } from "@/components/ui/toast"
import {
  generateSocialPackAction,
  generateStudioTtsAction,
  getSocialCandidatesAction,
} from "@/features/social-studio/actions"
import {
  SocialAngle,
  SocialGenerateRequest,
  StudioTtsRequest,
} from "@/features/social-studio/types"
import { useMutation, useQuery } from "@tanstack/react-query"

export function useSocialCandidates(angle: SocialAngle) {
  return useQuery({
    queryKey: ["socialCandidates", angle],
    queryFn: () => getSocialCandidatesAction(angle, 12),
  })
}

export function useGenerateSocialPack() {
  return useMutation({
    mutationFn: (data: SocialGenerateRequest) => generateSocialPackAction(data),
    onSuccess: () => {
      toast.add({
        description: "Gemini Pro content pack generated!",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Could not generate social pack",
        type: "error",
      })
    },
  })
}

export function useGenerateStudioTts() {
  return useMutation({
    mutationFn: (data: StudioTtsRequest) => generateStudioTtsAction(data),
    onSuccess: () => {
      toast.add({
        description: "Studio voiceover synthesized with Gemini Pro TTS!",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Could not synthesize studio voiceover",
        type: "error",
      })
    },
  })
}
