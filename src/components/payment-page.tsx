import QRCode from "react-qr-code"

import type { Transaction } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

interface PaymentPageProps {
  invoice: Transaction
}

/**
 * Only to be used inside a `DialogContent`
 */
export function PaymentPage({ invoice }: PaymentPageProps) {
  return (
    <>
      <p className="text-center text-lg font-semibold">
        Total: {formatPrice(invoice.amount)}
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
      <span className="mb-2 text-right text-sm text-muted-foreground">
        Created at&nbsp;
        {new Intl.DateTimeFormat("en-US", {
          timeStyle: "short",
          dateStyle: "medium",
        }).format(new Date(invoice.createdAt))}
      </span>

      <DialogFooter className="sm:justify-end">
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
