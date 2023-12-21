import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostForm } from "@/components/forms/post-form"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PostsLayout } from "@/components/layouts/dashboard-posts"

export default function AddPostPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add post</CardTitle>
      </CardHeader>
      <CardContent>
        <PostForm mode="add" />
      </CardContent>
    </Card>
  )
}

AddPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PostsLayout>{page}</PostsLayout>
    </DashboardLayout>
  )
}
