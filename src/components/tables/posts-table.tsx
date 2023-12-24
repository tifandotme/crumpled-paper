import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"

import type { Post } from "@/types/api"
import { postCategories } from "@/config"
import { cn, formatDate, toSentenceCase } from "@/lib/utils"
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

interface PostsTableProps {
  data: Post[]
}

export function PostsTable({ data: posts }: PostsTableProps) {
  const data = posts.map((post) => ({
    id: post.id,
    title: post.title,
    isPremium: post.isPremium ? "premium" : "free",
    category: post.category,
    likes: post.likers.length,
    updatedAt: post.updatedAt,
    createdAt: post.createdAt,
    slug: post.slug,
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
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ cell }) => {
          const type = cell.getValue() as Data["isPremium"]

          return (
            <Badge
              variant={type === "premium" ? "default" : "outline"}
              className={cn(
                type === "premium" &&
                  "bg-accent-premium hover:bg-accent-premium/80",
              )}
            >
              {toSentenceCase(type)}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "category",
        enableSorting: false,
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
          <DataTableColumnHeader column={column} title="Updated" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue() as Data["updatedAt"]

          return <span>{formatDate(date)}</span>
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
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
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px]">
              <DropdownMenuItem asChild>
                <Link
                  href={`/${row.original.slug}`}
                  target="_blank"
                  className="flex justify-between"
                >
                  View
                  <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/posts/edit/${row.original.id}`}>
                  Edit
                </Link>
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
      filterableColumns={[
        {
          id: "isPremium",
          title: "Type",
          options: [
            {
              label: "Free",
              value: "free",
            },
            {
              label: "Premium",
              value: "premium",
            },
          ],
        },
        {
          id: "category",
          title: "Category",
          options: postCategories.map((item) => ({
            label: `${item.charAt(0).toUpperCase()}${item.slice(1)}`,
            value: item,
          })),
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
