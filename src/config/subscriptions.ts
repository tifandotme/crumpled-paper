import type { SubscriptionPlan } from "@/types"

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
