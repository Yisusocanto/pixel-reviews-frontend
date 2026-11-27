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
    queryFn: async () => {
      const result = await getSocialCandidatesAction(angle, 12)
      if (!result.ok) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

export function useGenerateSocialPack() {
  return useMutation({
    mutationFn: async (data: SocialGenerateRequest) => {
      const result = await generateSocialPackAction(data)
      if (!result.ok) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      toast.add({
        description: "Content pack generated!",
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
    mutationFn: async (data: StudioTtsRequest) => {
      const result = await generateStudioTtsAction(data)
      if (!result.ok) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      toast.add({
        description: "Studio voiceover synthesized!",
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
