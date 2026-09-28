import { Developer } from "@/types/developer"
import { Publisher } from "@/types/publisher"

export interface Game {
  id: string
  title: string
  slug: string
  rawgId: string
  releaseDate: string
  imageUrl: string
  description: string
  screenshots: string[]
  developers: Developer[]
  publishers: Publisher[]
}
