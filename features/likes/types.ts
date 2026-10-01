export interface Like {
  id: string
  userId: string
  reviewId: string
  createdAt: Date
  updatedAt: Date
}

export interface LikeToggle {
  liked: boolean
  likesCount: number
}
