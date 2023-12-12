import React from "react"
import toast from "react-hot-toast"
import QRCode from "react-qr-code"

import type { SubscriptionPlan } from "@/types"
import { formatPrice } from "@/lib/utils"
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

interface ManageSubscriptionFormProps {
  plan: SubscriptionPlan
  isCurrentPlan: boolean
  isSubscribed: boolean
}

export function ManageSubscriptionForm({
  plan,
  isCurrentPlan,
  isSubscribed,
}: ManageSubscriptionFormProps) {
  const [isPaymentPageOpen, setIsPaymentPageOpen] = React.useState(false)

  const textContent = isCurrentPlan
    ? "You are subscribed. You can cancel your subscription at any time."
    : "If you wish to subscribe to this plan, proceed to the payment page."

  const buttonLabel = isCurrentPlan ? "Cancel subscription" : "Proceed"

  return (
    <Dialog onOpenChange={(open) => !open && setIsPaymentPageOpen(false)}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={isSubscribed && plan.id === "free"}
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
        {isPaymentPageOpen ? (
          <>
            <p className="text-center text-lg font-semibold">
              Total: {formatPrice(plan.price)}
            </p>
            <p className="text-center italic text-muted-foreground">
              You will be automatically redirected once the amount is paid
            </p>
            <span className="inline-flex items-center justify-center gap-2 text-accent-foreground">
              <Icons.Spinner className="inline-block h-4 w-4 animate-spin" />
              Awaiting payment..
            </span>
            <div className="mx-auto my-4 bg-white p-1">
              <QRCode value="https://www.google.com" />
            </div>
          </>
        ) : (
          textContent
        )}
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            onClick={() => {
              if (isCurrentPlan) {
                toast.success("Subscription cancelled")
              } else {
                setIsPaymentPageOpen((prev) => !prev)
              }
            }}
          >
            {isPaymentPageOpen ? "Cancel" : buttonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
