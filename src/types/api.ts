import type { z } from "zod"

import type { SubscriptionPlan } from "@/types"
import type { signUpSchema } from "@/lib/validations/auth"
import type { postSchema } from "@/lib/validations/post"

// GET /users/:id

export type Subscription = {
  type: SubscriptionPlan["id"]
  expiryDate: Date | null
  isSubscribed: boolean
}

export type User = {
  id: number
  role: "admin" | "user"
  token: string
  subscription: Subscription
} & z.infer<typeof signUpSchema>

// GET /posts/:id

export type Post = {
  id: number
  createdAt: Date
  updatedAt: Date
  likes: number
} & z.infer<typeof postSchema>
