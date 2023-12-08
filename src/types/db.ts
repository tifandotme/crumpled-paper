import type { z } from "zod"

import type { signUpSchema } from "@/lib/validations/auth"

// GET /users/:id

export type User = {
  id: number
  role: "admin" | "user"
  token: string
} & z.infer<typeof signUpSchema>
