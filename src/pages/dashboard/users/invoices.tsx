import useSWR from "swr"

import type { ExpandedTransaction } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { UsersLayout } from "@/components/layouts/dashboard-users"
import { InvoicesTable } from "@/components/tables/invoices-table"

export default function InvoicesPage() {
  const { data, isLoading, mutate } = useSWR<ExpandedTransaction[]>(
    "/transactions?_sort=createdAt&_order=desc&_expand=users",
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
      </div>

      {isLoading && <DataTableSkeleton columnCount={6} />}
      {!isLoading && data && <InvoicesTable data={data} mutate={mutate} />}
    </div>
  )
}

InvoicesPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <UsersLayout>{page}</UsersLayout>
    </DashboardLayout>
  )
}
