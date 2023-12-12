import React from "react"
import useSWR from "swr"

import type { User } from "@/types/api"
import { fetcher } from "@/lib/fetchers"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { UsersLayout } from "@/components/layouts/users"
import { SubscriptionsTableShell } from "@/components/shells/subscriptions-table-shell"

// export const getServerSideProps: GetServerSideProps<{
//   users: User[]
// }> = async () => {
//   const url = new URL("/users", process.env.NEXT_PUBLIC_DB_URL)
//   const res = await fetch(url)

//   return {
//     props: {
//       users: await res.json(),
//     },
//   }
// }

export default function SubscriptionsPage() {
  const { data, isLoading } = useSWR("/users", fetcher<User[]>, {
    revalidateOnFocus: false,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
      </div>

      {isLoading && (
        <DataTableSkeleton
          columnCount={6}
          isNewRowCreatable={true}
          isRowsDeletable={true}
        />
      )}
      {!isLoading && data && <SubscriptionsTableShell data={data} />}
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
