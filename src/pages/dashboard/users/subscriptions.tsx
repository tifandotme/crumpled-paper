import React from "react"
import useSWR from "swr"

import type { User } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { UsersLayout } from "@/components/layouts/dashboard-users"
import { SubscriptionsTable } from "@/components/tables/subscriptions-table"

export default function SubscriptionsPage() {
  const { data, isLoading, mutate } = useSWR<User[]>("/users")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
      </div>

      {isLoading && <DataTableSkeleton columnCount={7} />}
      {!isLoading && data && <SubscriptionsTable data={data} mutate={mutate} />}
    </div>
  )
}

SubscriptionsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <UsersLayout>{page}</UsersLayout>
    </DashboardLayout>
  )
}
