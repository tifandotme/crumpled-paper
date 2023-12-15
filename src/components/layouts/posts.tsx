import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

export function PostsLayout({ children }: React.PropsWithChildren) {
  return (
    <Shell variant="sidebar">
      <PageHeader separated>
        <PageHeaderHeading size="sm">Posts</PageHeaderHeading>
        <PageHeaderDescription size="sm">Manage posts</PageHeaderDescription>
      </PageHeader>

      <div className="space-y-8 overflow-auto">{children}</div>
    </Shell>
  )
}
