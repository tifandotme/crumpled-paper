import { useRouter } from "next/router"
import { Pencil1Icon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

export function PostsLayout({ children }: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <Shell variant="sidebar">
      <PageHeader separated className="relative">
        <PageHeaderHeading size="sm">Posts</PageHeaderHeading>
        <PageHeaderDescription size="sm">Manage posts</PageHeaderDescription>
        {router.pathname === "/dashboard/posts" && (
          <div className="absolute right-1 top-3.5">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/posts/add")}
            >
              <Pencil1Icon className="mr-2" /> Write a post
            </Button>
          </div>
        )}
      </PageHeader>

      {children}
    </Shell>
  )
}
