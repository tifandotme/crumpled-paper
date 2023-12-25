import { DashboardLayout } from "@/components/layouts/dashboard"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"
import { UserProfile } from "@/components/user-profile"

export default function AccountPage() {
  return (
    <Shell variant="sidebar">
      <PageHeader separated>
        <PageHeaderHeading size="sm">Account</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your account settings
        </PageHeaderDescription>
      </PageHeader>

      <UserProfile />
    </Shell>
  )
}

AccountPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}
