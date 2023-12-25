import QRCode from "react-qr-code"
import { toast } from "sonner"

import type { Transaction } from "@/types/api"
import { useStore } from "@/lib/store"
import { formatDate, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface PaymentPageProps {
  invoice: Transaction
}

/**
 * Only to be used inside a `DialogContent`
 */
export function PaymentPage({ invoice }: PaymentPageProps) {
  const user = useStore((state) => state.user)

  const paymentUrl = new URL(process.env.NEXT_PUBLIC_APP_URL as string)
  paymentUrl.pathname = `/payment/${invoice.id}`
  paymentUrl.searchParams.set("token", user?.token ?? "")

  return (
    <>
      <p className="text-center text-lg font-semibold">
        Total: {formatPrice(invoice.amount)}
      </p>
      <p className="text-center italic text-muted-foreground">
        You will be automatically redirected once the amount is paid
      </p>
      <span className="inline-flex items-center justify-center gap-2 text-accent-foreground">
        <Icons.Spinner className="h-4 w-4 animate-spin" />
        Awaiting payment..
      </span>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              className="mx-auto my-4 bg-white p-1"
              onClick={() => {
                navigator.clipboard.writeText(paymentUrl.toString())

                toast.success("Copied to clipboard")
              }}
              tabIndex={-1}
            >
              <QRCode value={paymentUrl.toString()} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Copy to clipboard</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className="mb-2 text-right text-sm text-muted-foreground">
        Created at&nbsp;
        {formatDate(invoice.createdAt)}
      </span>

      <DialogFooter className="sm:justify-end">
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
