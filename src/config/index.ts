import type {
  DashboardConfig,
  FooterLink,
  SiteConfig,
  SubscriptionPlan,
} from "@/types"

export const siteConfig: SiteConfig = {
  name: "QPost",
  description: "",
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "Avatar",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "CreditCard",
    },
  ],
  sidebarNavAdmin: [
    { title: "Posts", href: "/dashboard/posts", icon: "File" },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "Person",
    },
  ],
}

export const postCategories = [
  "uncategorized",
  "lifestyle",
  "food",
  "travel",
  "business",
  "culture",
] as const

export type PostCategories = (typeof postCategories)[number]

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for small businesses that want to sell online.",
    features: ["Create up to 1 store", "Create up to 20 products"],
    price: 0,
  },
  {
    id: "monthly",
    name: "Monthly",
    description: "Perfect for midsize businesses that want to sell online.",
    features: ["Create up to 2 store", "Create up to 20 products per store"],
    price: 39000,
  },
  {
    id: "yearly",
    name: "Yearly",
    description: "Perfect for big businesses that want to sell online.",
    features: [
      "Receive 2 months for free",
      "Create up to 20 products per store",
    ],
    price: 390000,
  },
]

export const footerLinks: FooterLink[] = [
  {
    title: "Company",
    links: [
      { title: "Blog", href: "#" },
      { title: "About", href: "#" },
      { title: "Press kit", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Service status", href: "#" },
      { title: "Support", href: "#" },
    ],
  },
]
