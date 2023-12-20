import React from "react"
import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"
import useSWR from "swr"

import type { Transaction } from "@/types/api"
import { subscriptionPlans } from "@/config"
import { fetcher } from "@/lib/fetchers"
import { useStore } from "@/lib/store"
import { cn, formatDate, formatPrice, toSentenceCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { ManageSubscriptionForm } from "@/components/manage-subscription-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { PaymentPage } from "@/components/payment-page"
import { Shell } from "@/components/shell"

export default function BillingPage() {
  const { loading, user } = useStore(({ loading, user }) => ({ loading, user }))

  const { data: invoice, mutate } = useSWR(
    user
      ? `/transactions?usersId=${user.id}&status=unpaid&_sort=createdAt&_order=desc`
      : null,
    async (url) => {
      const json = await fetcher<Transaction[]>(url)

      return json[0]
    },
    {
      refreshInterval: 1000,
      onSuccess: () => {
        console.log("success")
      },
    },
  )

  const currPlan = user?.subscription

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
        <Card className="grid gap-4 p-6">
          {loading && (
            <>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-64" />
            </>
          )}
          {!loading && currPlan && (
            <>
              <h3 className="text-lg font-semibold sm:text-xl">
                {toSentenceCase(currPlan.type)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currPlan.isSubscribed && currPlan.expiryDate
                  ? `Your plan renews on ${formatDate(currPlan.expiryDate)}`
                  : "Upgrade to get access to premium posts"}
              </p>
              {invoice && (
                <p className="text-sm text-yellow-600">
                  <ExclamationTriangleIcon className="mr-2 inline h-4 w-4" />
                  You have unpaid invoice waiting for payment.
                  <PayNowPrompt invoice={invoice} />
                </p>
              )}
            </>
          )}
        </Card>
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
                <CardTitle className="line-clamp-1 flex items-center gap-2">
                  {plan.name}
                  {currPlan?.type === plan.id && (
                    <Badge className="text-sm">Active</Badge>
                  )}
                </CardTitle>
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
                  isSubscribed={currPlan?.isSubscribed ?? false}
                  isCurrentPlan={currPlan?.type === plan.id}
                  invoice={invoice}
                  mutate={mutate}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </Shell>
  )
}

interface PayNowPromptProps {
  invoice: Transaction
}

function PayNowPrompt({ invoice }: PayNowPromptProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="inline-block h-fit">
          Pay now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe</DialogTitle>
        </DialogHeader>
        <PaymentPage invoice={invoice} />
      </DialogContent>
    </Dialog>
  )
}

BillingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}
