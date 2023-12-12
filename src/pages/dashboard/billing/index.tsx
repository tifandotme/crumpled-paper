import React from "react"
import { CheckIcon } from "@radix-ui/react-icons"

import { subscriptionPlans } from "@/config/subscriptions"
import { useStore } from "@/lib/store"
import { cn, formatDate, formatPrice } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { ManageSubscriptionForm } from "@/components/manage-subscription-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

export default function BillingPage() {
  const { loading, user } = useStore(({ loading, user }) => ({ loading, user }))

  const subscriptionPlan = user?.subscription

  return (
    <Shell variant="sidebar">
      <PageHeader separated>
        <PageHeaderHeading size="sm">Billing</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your billing and subscription
        </PageHeaderDescription>
      </PageHeader>

      <section className="space-y-5">
        <h2 className="text-xl font-semibold sm:text-2xl">Billing info</h2>
        {loading && <Skeleton className="h-20 w-full" />}
        {!loading && (
          <Card className="grid gap-4 p-6">
            <h3 className="text-lg font-semibold sm:text-xl">Free</h3>
            <p className="text-sm text-muted-foreground">
              {subscriptionPlan?.isSubscribed && subscriptionPlan.expiryDate
                ? `Your plan renews on ${formatDate(
                    subscriptionPlan.expiryDate,
                  )}`
                : "Upgrade to get access to premium posts"}
            </p>
          </Card>
        )}
      </section>
      <section className="space-y-5 pb-2.5">
        <h2 className="text-xl font-semibold sm:text-2xl">
          Subscription plans
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {subscriptionPlans.map((plan, i) => (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col",
                i === subscriptionPlans.length - 1 &&
                  "lg:col-span-2 xl:col-span-1",
                i === 1 && "border-primary shadow-md",
              )}
            >
              <CardHeader>
                <CardTitle className="line-clamp-1">{plan.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid flex-1 place-items-start gap-6">
                <div className="text-3xl font-bold">
                  {formatPrice(plan.price)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.id === "yearly" ? "/year" : "/month"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <ManageSubscriptionForm
                  plan={plan}
                  isSubscribed={subscriptionPlan?.isSubscribed ?? false}
                  isCurrentPlan={subscriptionPlan?.type === plan.id}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </Shell>
  )
}

BillingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}
