import React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { type KeyedMutator } from "swr"

import type { User } from "@/types/api"
import { subscriptionPlans } from "@/config"
import { updateSubscription } from "@/lib/fetchers"
import { formatDate, toSentenceCase } from "@/lib/utils"
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

interface SubscriptionsTableProps<TData = User[]> {
  data: TData
  mutate: KeyedMutator<TData>
}

export function SubscriptionsTable({
  data: users,
  mutate,
}: SubscriptionsTableProps) {
  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    type: user.subscription.type,
    status: user.subscription.isSubscribed ? "active" : "inactive",
    expiryDate: user.subscription.expiryDate,
    phone: user.phone,
    address: user.address,
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
      {
        accessorKey: "type",
        enableSorting: false,
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
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "status",
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue() as Data["status"]

          return (
            <Badge variant="outline" className="capitalize">
              {toSentenceCase(status)}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "expiryDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expiry Date" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue() as Data["expiryDate"]

          if (date === null) {
            return <span>-</span>
          }

          return <span>{formatDate(date)}</span>
        },
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ cell }) => {
          const phone = cell.getValue() as Data["phone"]

          return <span className="whitespace-nowrap">{phone}</span>
        },
      },
      {
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Address" />
        ),
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
                  const handleActivation = async () => {
                    const { success } = await updateSubscription(
                      row.original.id,
                      {
                        expiryDate: row.original.expiryDate,
                        type: row.original.type,
                        isSubscribed: true,
                      },
                    )

                    if (!success) throw new Error()

                    await mutate()
                  }

                  toast.promise(handleActivation(), {
                    loading: "Processing...",
                    success: "Subscription activated",
                    error: "Failed to activate subscription. Try again later",
                  })
                }}
                disabled={
                  row.original.type === "free" ||
                  row.original.status === "active"
                }
              >
                Activate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const handleActivation = async () => {
                    const { success } = await updateSubscription(
                      row.original.id,
                      {
                        expiryDate: row.original.expiryDate,
                        type: row.original.type,
                        isSubscribed: true,
                      },
                    )

                    if (!success) throw new Error()

                    await mutate()
                  }

                  toast.promise(handleActivation(), {
                    loading: "Processing...",
                    success: "Subscription deactivated",
                    error: "Failed to deactivate subscription. Try again later",
                  })
                }}
                disabled={
                  row.original.type === "free" ||
                  row.original.status === "inactive"
                }
              >
                Deactivate
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
      pageCount={Math.ceil(data.length / 10)}
      filterableColumns={[
        {
          id: "type",
          title: "Plan",
          options: subscriptionPlans.map(({ id: item }) => ({
            label: `${item.charAt(0).toUpperCase()}${item.slice(1)}`,
            value: item,
          })),
        },
        {
          id: "status",
          title: "Status",
          options: [
            {
              label: "Active",
              value: "active",
            },
            {
              label: "Inactive",
              value: "inactive",
            },
          ],
        },
      ]}
      searchableColumns={[
        {
          id: "email",
          title: "Email",
        },
      ]}
    />
  )
}
