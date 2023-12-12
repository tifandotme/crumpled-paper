import z from "zod"

import { postCategories } from "@/config"

export const postSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  content: z.string().min(2, {
    message: "Content must be at least 100 characters long",
  }),
  isPremium: z.boolean(),
  image: z.string(),
  category: z.enum(postCategories).default(postCategories[0]),
})
