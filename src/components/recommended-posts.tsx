import React from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

import type { Post } from "@/types/api"
import type { PostCategories } from "@/config"
import { useStore } from "@/lib/store"
import { formatDate, getBase64, readingTime } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const POST_COUNT = 3

interface RecommendedPostsProps {
  currPostId: number
}

export function RecommendedPosts({ currPostId }: RecommendedPostsProps) {
  const user = useStore((state) => state.user)

  const { data: posts, isLoading } = useSWR<Post[]>("/posts")

  const recommendedPosts = React.useMemo(() => {
    if (!posts) return

    if (!user) {
      return posts
        .sort((a, b) => b.likers.length - a.likers.length)
        .slice(0, POST_COUNT)
    }

    const categories = posts.reduce(
      (acc, post) => {
        if (post.likers.includes(user.id)) {
          const category = post.category

          acc[category] = (acc[category] ?? 0) + 1
        }
        return acc
      },
      {} as Record<PostCategories, number>,
    )

    const mostLikedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category)

    const rankedPosts =
      mostLikedCategories.length > 0
        ? mostLikedCategories
            .map((category) => {
              return posts.filter((post) => post.category === category)
            })
            .flat()
        : posts

    return rankedPosts
      .filter((post) => post.id !== currPostId)
      .slice(0, POST_COUNT)
  }, [posts, currPostId, user])

  return (
    <section className="container mb-16 max-w-screen-lg px-4 2xl:px-0">
      <h2 className="mb-8 text-center text-xl font-semibold uppercase text-muted-foreground">
        Recommended posts
      </h2>
      <div className="grid grid-flow-row grid-cols-6 gap-4 xl:grid-cols-9">
        {isLoading
          ? Array.from({ length: POST_COUNT }).map((_, idx) => (
              <Card
                key={idx}
                className="col-span-full p-5 md:col-span-3 lg:col-span-2 xl:col-span-3"
              >
                <AspectRatio ratio={16 / 10}>
                  <Skeleton className="absolute h-full w-full" />
                </AspectRatio>

                <div className="mt-4 flex flex-col gap-2">
                  <Skeleton className="my-1 h-7 w-full" />
                  <Skeleton className="mb-2 mt-1 h-5 w-1/3" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                </div>
              </Card>
            ))
          : recommendedPosts?.map((post) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="col-span-full md:col-span-3 lg:col-span-2 xl:col-span-3"
              >
                <Card className="p-5">
                  <AspectRatio ratio={16 / 10}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={1600}
                      height={1000}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="aspect-[16/10] rounded-lg object-cover"
                      placeholder={`data:image/svg+xml;base64,${getBase64(
                        278,
                        173.75,
                      )}`}
                      loading="lazy"
                    />
                  </AspectRatio>
                  <div className="mt-4 flex flex-col gap-1">
                    <h3 className="line-clamp-2 text-lg font-bold">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                      <time dateTime={post.updatedAt}>
                        {formatDate(post.updatedAt)}
                      </time>
                      <span className="select-none text-xs text-muted-foreground">
                        &bull;
                      </span>
                      <span>{readingTime(post.content)} min read</span>
                    </div>
                    <p className="line-clamp-3">{post.content}</p>
                  </div>
                </Card>
              </Link>
            ))}
      </div>
    </section>
  )
}
