import React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { ExpandedTransaction, Transaction } from "@/types/api"
import { updateSubscription, updateTransaction } from "@/lib/fetchers"
import { cn, formatDate, formatPrice, toSentenceCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InvoicesTableProps<TData = ExpandedTransaction[]> {
  data: TData
  mutate: KeyedMutator<TData>
}

export function InvoicesTable({
  data: transactions,
  mutate,
}: InvoicesTableProps) {
  const data = transactions.map((transaction) => ({
    id: transaction.id,
    userId: transaction.users.id,
    name: transaction.users.name,
    email: transaction.users.email,
    amount: transaction.amount,
    type: transaction.type,
    status: transaction.status,
    createdAt: transaction.createdAt,
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        minSize: 200,
        maxSize: 200,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "email",
        minSize: 250,
        maxSize: 250,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ cell }) => {
          const amount = cell.getValue() as Data["amount"]

          return (
            <span className="whitespace-nowrap">{formatPrice(amount)}</span>
          )
        },
      },
      {
        accessorKey: "type",
        enableSorting: false,
        minSize: 110,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Plan" />
        ),
        cell: ({ cell }) => {
          const type = cell.getValue() as Data["type"]

          return (
            <Badge variant="outline" className="capitalize">
              {type}
            </Badge>
          )
        },
      },
      {
        accessorKey: "status",
        enableSorting: false,
        minSize: 110,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue() as Data["status"]

          const bg: Partial<Record<typeof status, string>> = {
            approved: "bg-green-200 hover:bg-green-200/80",
            declined: "bg-red-200 hover:bg-red-200/80",
            deactivated: "bg-red-200 hover:bg-red-200/80",
          }

          return (
            <Badge variant="secondary" className={cn("capitalize", bg[status])}>
              {toSentenceCase(status)}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "createdAt",
        minSize: 190,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue() as Data["createdAt"]

          return (
            <span className="whitespace-nowrap">{formatDate(date, true)}</span>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => {
                  const handleApproval = async () => {
                    const { success } = await updateTransaction(
                      row.original.id,
                      "approved",
                    )

                    if (!success) throw new Error()

                    const expiryDate = new Date()
                    const months = row.original.status ? 1 : 12
                    expiryDate.setMonth(expiryDate.getMonth() + months)

                    const { success: success2 } = await updateSubscription(
                      row.original.userId,
                      {
                        expiryDate,
                        isSubscribed: true,
                        type: row.original.type,
                      },
                    )

                    if (!success2) {
                      await updateTransaction(row.original.id, "pending")
                      throw new Error()
                    }

                    await mutate()
                  }

                  toast.promise(handleApproval(), {
                    loading: "Processing...",
                    success: "Invoice approved",
                    error: "Failed to approve invoice. Try again later",
                  })
                }}
                disabled={row.original.status !== "pending"}
              >
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const handleRejection = async () => {
                    const { success } = await updateTransaction(
                      row.original.id,
                      "declined",
                    )

                    if (!success) throw new Error()

                    await mutate()
                  }

                  toast.promise(handleRejection(), {
                    loading: "Processing...",
                    success: "Invoice rejected",
                    error: "Failed to reject invoice. Try again later",
                  })
                }}
                disabled={row.original.status !== "pending"}
              >
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [mutate],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      filterableColumns={[
        {
          id: "status",
          title: "Status",
          options: (
            [
              "unpaid",
              "pending",
              "approved",
              "declined",
              "deactivated",
            ] as Transaction["status"][]
          ).map((status) => ({
            label: `${status.charAt(0).toUpperCase()}${status.slice(1)}`,
            value: status,
          })),
        },
      ]}
      searchableColumns={[
        // TODO filter by date
        {
          id: "name",
          title: "Name",
        },
      ]}
    />
  )
}
