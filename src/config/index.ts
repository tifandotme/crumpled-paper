import type {
  DashboardConfig,
  FooterLink,
  SiteConfig,
  SubscriptionPlan,
} from "@/types"

export const siteConfig: SiteConfig = {
  name: "Crumpled Paper",
  description: "Where great ideas begin.",
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
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "Gear",
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
    features: ["Start leveling up your knowledge"],
    price: 0,
  },
  {
    id: "monthly",
    name: "Monthly",
    description: "Perfect for midsize businesses that want to sell online.",
    features: [
      "Unlock premium posts",
      "Read offline",
      "Reward creators",
      "Connect with the community",
    ],
    price: 39000,
  },
  {
    id: "yearly",
    name: "Yearly",
    description: "Perfect for big businesses that want to sell online.",
    features: ["Same as Monthly plan", "2 months off"],
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
