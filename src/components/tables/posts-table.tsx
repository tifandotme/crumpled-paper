import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import toast from "react-hot-toast"
import { mutate } from "swr"

import type { Post } from "@/types/api"
import { postCategories } from "@/config"
import { deletePost } from "@/lib/fetchers"
import { cn, formatDate } from "@/lib/utils"
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

export function PostsTable({ data: posts }: { data: Post[] }) {
  const data = posts.map((post) => ({
    id: post.id,
    title: post.title,
    isPremium: post.isPremium ? "premium" : "free",
    category: post.category,
    likes: post.likes,
    updatedAt: post.updatedAt,
    createdAt: post.createdAt,
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Title"
            className="min-w-[28ch]"
          />
        ),
      },
      {
        accessorKey: "isPremium",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ cell }) => {
          const type = cell.getValue() as Data["isPremium"]

          return (
            <Badge
              variant="outline"
              className={cn(type === "premium" && "border-0 bg-yellow-200")}
            >
              {type}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ cell }) => {
          const category = cell.getValue() as Data["category"]

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
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Updated" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue() as Data["updatedAt"]

          return <span>{formatDate(date)}</span>
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue() as Data["createdAt"]

          return <span>{formatDate(date)}</span>
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
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px]">
              <DropdownMenuItem asChild>
                <Link href="/">View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/posts/edit/${row.original.id}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={async () => {
                  await toast.promise(deletePost(row.original.id), {
                    loading: "Deleting post...",
                    success: (data) => data.message,
                    error: (err) => err.message,
                  })

                  await mutate("/posts")
                }}
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
          id: "category",
          title: "Category",
          options: postCategories.map((item) => ({
            label: `${item.charAt(0).toUpperCase()}${item.slice(1)}`,
            value: item,
          })),
        },
        {
          id: "isPremium",
          title: "Type",
          options: [
            {
              label: "Free",
              value: "free",
            },
            {
              label: "Premium ✨",
              value: "premium",
            },
          ],
        },
      ]}
      searchableColumns={[
        {
          id: "title",
          title: "Title",
        },
      ]}
    />
  )
}
