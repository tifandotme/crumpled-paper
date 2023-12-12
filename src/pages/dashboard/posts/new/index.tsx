import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostForm } from "@/components/forms/post-form"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PostsLayout } from "@/components/layouts/posts"

export default function NewPostPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">New post</CardTitle>
      </CardHeader>
      <CardContent>
        <PostForm />
      </CardContent>
    </Card>
  )
}

NewPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PostsLayout>{page}</PostsLayout>
    </DashboardLayout>
  )
}
