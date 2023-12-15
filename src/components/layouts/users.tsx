import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"
import { UsersTabs } from "@/components/users-tabs"

export function UsersLayout({ children }: React.PropsWithChildren) {
  return (
    <Shell variant="sidebar">
      <div className="flex flex-col gap-4 pr-1 xxs:flex-row">
        <PageHeader className="flex-1">
          <PageHeaderHeading size="sm">Users</PageHeaderHeading>
          <PageHeaderDescription size="sm">
            Manage users and their subscriptions.
          </PageHeaderDescription>
        </PageHeader>
      </div>
      <div className="space-y-8 overflow-auto">
        <UsersTabs />
        {children}
      </div>
    </Shell>
  )
}
