import { DashboardLayout } from "@/components/layouts/dashboard"
import { UsersLayout } from "@/components/layouts/users"

export default function InvoicesPage() {
  return <>invoices</>
}

InvoicesPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <UsersLayout>{page}</UsersLayout>
    </DashboardLayout>
  )
}
