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
  slug: string
  createdAt: string
  updatedAt: string
  likers: User["id"][]
  shareCount: number
} & z.infer<typeof postSchema>

// GET /transactions/:id

export type Transaction = {
  id: number
  usersId: User["id"]
  amount: number
  status: "unpaid" | "pending" | "approved" | "declined" | "deactivated"
  type: SubscriptionPlan["id"]
  createdAt: string
}

// GET /transactions/:id?_expand=users

export type ExpandedTransaction = Omit<Transaction, "usersId"> & {
  users: User
}
