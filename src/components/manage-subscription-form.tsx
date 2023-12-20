import React from "react"
import type { KeyedMutator } from "swr"

import type { SubscriptionPlan } from "@/types"
import type { Transaction } from "@/types/api"
import { addTransaction } from "@/lib/fetchers"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"
import { PaymentPage } from "@/components/payment-page"

interface ManageSubscriptionFormProps {
  plan: SubscriptionPlan
  isCurrentPlan: boolean
  isSubscribed: boolean
  invoice?: Transaction
  mutate: KeyedMutator<Transaction | undefined>
}

export function ManageSubscriptionForm({
  plan,
  isCurrentPlan,
  isSubscribed,
  invoice,
  mutate,
}: ManageSubscriptionFormProps) {
  const [isPaymentPageOpen, setIsPaymentPageOpen] = React.useState(false)

  return (
    <Dialog onOpenChange={(open) => !open && setIsPaymentPageOpen(false)}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={
            (isSubscribed && plan.id === "free") ||
            (!isCurrentPlan && Boolean(invoice))
          }
        >
          {isCurrentPlan ? "Manage" : "Subscribe"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCurrentPlan ? "Manage subscription" : "Subscribe"}
          </DialogTitle>
        </DialogHeader>
        {isPaymentPageOpen && invoice ? (
          <PaymentPage invoice={invoice} />
        ) : (
          <MainPage
            plan={plan}
            isCurrentPlan={isCurrentPlan}
            setIsPaymentPageOpen={setIsPaymentPageOpen}
            mutate={mutate}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface MainPageProps {
  isCurrentPlan: boolean
  plan: SubscriptionPlan
  setIsPaymentPageOpen: React.Dispatch<React.SetStateAction<boolean>>
  mutate: KeyedMutator<Transaction | undefined>
}

function MainPage({
  isCurrentPlan,
  plan,
  setIsPaymentPageOpen,
  mutate,
}: MainPageProps) {
  const user = useStore((state) => state.user)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleCancelation = async () => {
    if (!user) return

    setIsLoading(true)
    console.log("canceling subscription")
    setIsLoading(false)
  }

  const handlePayment = async () => {
    if (!user) return

    setIsLoading(true)
    await addTransaction(user.id, plan.id)
    await mutate()
    setIsLoading(false)

    setIsPaymentPageOpen(true)
  }

  return (
    <>
      <p>
        {isCurrentPlan
          ? "You are subscribed. You can cancel your subscription at any time."
          : "If you wish to subscribe to this plan, proceed to the payment page."}
      </p>

      <DialogFooter className="sm:justify-end">
        <Button
          onClick={async () => {
            if (isCurrentPlan) {
              await handleCancelation()
            } else {
              await handlePayment()
            }
          }}
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className={cn("min-w-24", isLoading && "pointer-events-none")}
        >
          {isLoading ? (
            <Icons.Spinner className="h-4 w-4 animate-spin" />
          ) : isCurrentPlan ? (
            "Cancel subscription"
          ) : (
            "Proceed"
          )}
        </Button>
      </DialogFooter>
    </>
  )
}
