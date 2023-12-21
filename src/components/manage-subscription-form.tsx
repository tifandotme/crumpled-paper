import React from "react"
import { PopoverClose } from "@radix-ui/react-popover"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { SubscriptionPlan } from "@/types"
import type { Transaction } from "@/types/api"
import { addTransaction, updateSubscription } from "@/lib/fetchers"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"
import { PaymentPage } from "@/components/payment-page"

interface ManageSubscriptionFormProps {
  plan: SubscriptionPlan
  isCurrentPlan: boolean
  invoice?: Transaction | null
  mutate: KeyedMutator<any>
}

export function ManageSubscriptionForm({
  plan,
  isCurrentPlan,
  invoice,
  mutate,
}: ManageSubscriptionFormProps) {
  const [isPaymentPageOpen, setIsPaymentPageOpen] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (invoice?.status === "pending") {
      setOpen(false)
    }
  }, [invoice])

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen((prev) => !prev)
        !open && setIsPaymentPageOpen(false)
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={plan.id === "free" || (!isCurrentPlan && Boolean(invoice))}
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
  mutate: KeyedMutator<any>
}

function MainPage({
  isCurrentPlan,
  plan,
  setIsPaymentPageOpen,
  mutate,
}: MainPageProps) {
  const user = useStore((state) => state.user)
  const updateUser = useStore((state) => state.updateUser)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleCancelation = async () => {
    if (!user) return

    setIsLoading(true)
    const { success, data } = await updateSubscription(user.id, {
      expiryDate: null,
      isSubscribed: false,
      type: "free",
    })

    if (!success) {
      toast.error("Failed to cancel subscription")
      return
    }

    data && updateUser(data)
    toast.success("Subscription cancelled")

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
        {isCurrentPlan ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className={"min-w-24"}
              >
                Cancel subscription
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[250px] space-y-4 text-center">
              <span>Are you sure?</span>
              <div className="flex gap-2 [&>*]:w-full">
                <Button
                  onClick={handleCancelation}
                  size="sm"
                  variant="destructive"
                  className={cn(isLoading && "pointer-events-none")}
                >
                  {isLoading ? (
                    <Icons.Spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    "Yes"
                  )}
                </Button>
                <PopoverClose asChild>
                  <Button size="sm">No</Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            onClick={handlePayment}
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className={cn("min-w-24", isLoading && "pointer-events-none")}
          >
            {isLoading ? (
              <Icons.Spinner className="h-4 w-4 animate-spin" />
            ) : (
              "Proceed"
            )}
          </Button>
        )}
      </DialogFooter>
    </>
  )
}
