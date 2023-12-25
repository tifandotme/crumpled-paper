import { z } from "zod"

import { authSchema } from "@/lib/validations/auth"

export const profileSchema = z.object({
  name: authSchema.shape.name,
  email: authSchema.shape.email,
  address: authSchema.shape.address,
  phone: authSchema.shape.phone,
})
