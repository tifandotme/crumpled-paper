import Link from "next/link"
import useSWR from "swr"

import type { Post } from "@/types/api"
import { cn } from "@/lib/utils"
import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const POST_COUNT = 5

export function TrendingPosts() {
  const { data: posts, isLoading } = useSWR<Post[]>(
    `/posts?_sort=likes&_order=desc&_limit=${POST_COUNT}`,
  )

  return (
    <CardContent className={cn(isLoading ? "mb-1 space-y-4" : "space-y-3")}>
      {isLoading
        ? Array.from({ length: POST_COUNT }).map((_, idx) => (
            <div key={idx} className="space-y-1">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))
        : posts?.map((post) => (
            <article key={post.id}>
              <Link href={`/${post.slug}`}>
                <h4 className="line-clamp-2 font-semibold">{post.title}</h4>
              </Link>
              <span className="text-muted-foreground">
                {post.likers.length} likes
              </span>
            </article>
          ))}
    </CardContent>
  )
}
