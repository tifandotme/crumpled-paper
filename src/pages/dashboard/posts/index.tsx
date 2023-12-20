import React from "react"
import useSWR from "swr"

import type { Post } from "@/types/api"
import { fetcher } from "@/lib/fetchers"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PostsLayout } from "@/components/layouts/posts"
import { PostsTable } from "@/components/tables/posts-table"

export default function PostsPage() {
  const { data, isLoading } = useSWR("/posts", fetcher<Post[]>, {
    revalidateOnFocus: false,
  })

  return (
    <div className="space-y-6 overflow-auto">
      {isLoading && <DataTableSkeleton columnCount={6} />}
      {!isLoading && data && <PostsTable data={data} />}
    </div>
  )
}

PostsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PostsLayout>{page}</PostsLayout>
    </DashboardLayout>
  )
}
