import React from "react"
import useSWR from "swr"

import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PostsLayout } from "@/components/layouts/dashboard-posts"
import { PostsTable } from "@/components/tables/posts-table"

export default function PostsPage() {
  const { data, isLoading } = useSWR("/posts?_sort=createdAt&_order=desc")

  return (
    <div className="space-y-6 overflow-auto">
      {isLoading && <DataTableSkeleton columnCount={5} />}
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
