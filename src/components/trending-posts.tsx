import useSWR from "swr"

import type { Post } from "@/types/api"
import { fetcher } from "@/lib/fetchers"
import { cn } from "@/lib/utils"
import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TrendingPosts() {
  const { data: posts, isLoading } = useSWR(
    "/posts?_sort=likes&_order=desc&_limit=5",
    fetcher<Post[]>,
    {
      revalidateOnFocus: false,
    },
  )

  return (
    <CardContent className={cn(isLoading ? "mb-1 space-y-4" : "space-y-3")}>
      {isLoading &&
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[70%]" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      {!isLoading &&
        posts?.map((post) => (
          <article key={post.id}>
            <h4 className="line-clamp-2 font-semibold">{post.title}</h4>
            <span className="text-muted-foreground">{post.likes} likes</span>
          </article>
        ))}
    </CardContent>
  )
}
