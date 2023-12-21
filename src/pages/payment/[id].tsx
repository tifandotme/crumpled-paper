import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"

import type { ExpandedTransaction } from "@/types/api"
import { updateTransaction } from "@/lib/fetchers"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const getServerSideProps: GetServerSideProps<{
  paymentId: string
}> = async (context) => {
  const paymentId = context.params?.id as string
  const token = context.query.token as string | undefined

  const url = new URL(
    `/transactions/${paymentId}?_expand=users`,
    process.env.NEXT_PUBLIC_DB_URL,
  )
  const res = await fetch(url)

  const transaction: ExpandedTransaction = await res.json()

  if (
    !res.ok ||
    !token ||
    transaction.users.token !== token ||
    transaction.status !== "unpaid"
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      paymentId,
    },
  }
}

export default function PaymentGatewayPage({
  paymentId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPaid, setIsPaid] = React.useState(false)

  const handlePay = async () => {
    setIsLoading(true)
    await updateTransaction(Number(paymentId), "pending")
    setIsLoading(false)
    setIsPaid(true)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {isPaid ? (
        <span>Payment sucessful. You can close this page.</span>
      ) : (
        <Button size="lg" onClick={handlePay}>
          {isLoading ? (
            <Icons.Spinner className="h-4 w-4 animate-spin" />
          ) : (
            "Pay"
          )}
        </Button>
      )}
    </div>
  )
}
