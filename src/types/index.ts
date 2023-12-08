import type { z } from "zod"

import type { signInSchema, signUpSchema } from "@/lib/validations/auth"

export type SignInInputs = z.infer<typeof signInSchema>

export type SignUpInputs = z.infer<typeof signUpSchema>
