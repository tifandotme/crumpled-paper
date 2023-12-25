import type { z } from "zod"

import type { signInSchema, signUpSchema } from "@/lib/validations/auth"
import type { postSchema } from "@/lib/validations/post"
import type { profileSchema } from "@/lib/validations/profile"
import type { Icons } from "@/components/icons"

export interface Option {
  label: string
  value: string
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}

export type Response<TData = unknown> = {
  success: boolean
  message: string
  data?: TData
}

export type SignInInputs = z.infer<typeof signInSchema>

export type SignUpInputs = z.infer<typeof signUpSchema>

export type PostInputs = z.infer<typeof postSchema>

export type EditProfileInputs = z.infer<typeof profileSchema>

export type SiteConfig = {
  name: string
  description: string
}

export type NavItem = {
  title: string
  href: string
  icon?: keyof typeof Icons
}

export type DashboardConfig = {
  sidebarNav: NavItem[]
  sidebarNavAdmin: NavItem[]
}

export type SubscriptionPlan = {
  id: "free" | "monthly" | "yearly"
  name: string
  description: string
  features: string[]
  price: number
}

export type FooterLink = {
  title: string
  links: Omit<NavItem, "icon">[]
}
