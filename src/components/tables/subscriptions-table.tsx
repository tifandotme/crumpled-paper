import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"

import type { User } from "@/types/api"
import { subscriptionPlans } from "@/config"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SubscriptionsTable({ data: users }: { data: User[] }) {
  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.subscription.type,
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
        accessorKey: "plan",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Plan" />
        ),
        cell: ({ cell }) => {
          const category = cell.getValue() as Data["plan"]

          return (
            <Badge variant="outline" className="capitalize">
              {category}
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
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link href="/">Approve</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Reject</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // startTransition(() => {
                  //   row.toggleSelected(false)
                  //   toast.promise(
                  //     deleteProduct({
                  //       id: row.original.id,
                  //       storeId,
                  //     }),
                  //     {
                  //       loading: "Deleting...",
                  //       success: () => "Product deleted successfully.",
                  //       error: (err: unknown) => catchError(err),
                  //     },
                  //   )
                  // })
                }}
                disabled={true}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={Math.ceil(data.length / 10)}
      filterableColumns={[
        {
          id: "plan",
          title: "Status",
          options: subscriptionPlans.map(({ id: item }) => ({
            label: `${item.charAt(0).toUpperCase()}${item.slice(1)}`,
            value: item,
          })),
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
