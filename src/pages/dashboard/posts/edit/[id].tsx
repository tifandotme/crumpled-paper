import { useRouter } from "next/router"
import useSWR from "swr"

import type { Post } from "@/types/api"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PostForm } from "@/components/forms/post-form"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PostsLayout } from "@/components/layouts/dashboard-posts"

export default function EditPostPage() {
  const router = useRouter()

  const id = router.query.id as string
  const { data, isLoading } = useSWR<Post>(`/posts/${id}`, {
    onError: () => {
      router.push("/dashboard/posts")
    },
  })

  return (
    <>
      {isLoading && (
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-xl gap-4">
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6" />
              </div>
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-44" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      )}
      {!isLoading && data && (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Edit post</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm mode="edit" initialData={data} />
          </CardContent>
        </Card>
      )}
    </>
  )
}

EditPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PostsLayout>{page}</PostsLayout>
    </DashboardLayout>
  )
}
