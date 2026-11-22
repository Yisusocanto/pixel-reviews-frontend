import { Statistics } from "@/features/charts/types"
import { apiClient } from "@/lib/api/client"

export async function getStatisticsAction() {
  const res = await apiClient.get<Statistics>("/discover")
  return res
}
