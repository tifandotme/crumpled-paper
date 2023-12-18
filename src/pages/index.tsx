import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons"
import useSWRInfinite from "swr/infinite"

import type { Post } from "@/types/api"
import { fetcher } from "@/lib/fetchers"
import { formatDate, toSentenceCase } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { RootLayout } from "@/components/layouts/root"
import { Shell } from "@/components/shell"
import { TrendingPosts } from "@/components/trending-posts"

// export const getServerSideProps: GetServerSideProps<{
//   posts: Post[]
// }> = async (context) => {
//   const page = (context.query?.page as string) ?? "1"
//   const limit = String(Number(page) * 10)

//   const url = new URL("/posts", process.env.NEXT_PUBLIC_DB_URL)
//   url.searchParams.append("_page", page)
//   url.searchParams.append("_limit", limit)

//   const res = await fetch(url)

//   const posts = await res.json()

//   return {
//     props: {
//       posts,
//     },
//   }
// }

const PAGE_SIZE = 10

export default function HomePage() {
  const router = useRouter()

  const { data, isLoading, size, setSize } = useSWRInfinite(
    (idx) => `/posts?_page=${idx + 1}`,
    fetcher<Post[]>,
    {
      initialSize: 1,
      persistSize: true,
      revalidateOnFocus: false,
    },
  )

  const posts = data ? ([] as Post[]).concat(...data) : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && (data[data.length - 1]?.length ?? 0) < PAGE_SIZE)

  return (
    <Shell className="max-w-screen-xl grid-cols-12 items-start gap-10 px-14">
      <section className="col-span-8">
        <div className="mb-4 space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 data-[state=open]:bg-accent"
              >
                <span>Foo</span>
                {/* {column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              ) : ( */}
                <CaretSortIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                {/* )} */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                aria-label="Sort ascending"
                // onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpIcon
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sort descending"
                // onClick={() => column.toggleSorting(true)}
              >
                <ArrowDownIcon
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Desc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span>foo</span>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="flex gap-4">
                <div className="w-full">
                  <h2 className="mb-2 text-2xl font-bold tracking-tight">
                    {post.id} - {post.title}
                  </h2>
                  <p className="line-clamp-3">{post.content}</p>
                </div>
                <div className="min-w-[180px]">
                  <AspectRatio ratio={16 / 10}>
                    <Image
                      className="absolute h-[112.5px] w-[180px] rounded-lg object-cover"
                      width="1600"
                      height="1000"
                      src={post.image}
                      alt="thumbnail"
                    />
                  </AspectRatio>
                </div>
              </div>
              <div className="flex justify-between gap-4 text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <time dateTime={post.updatedAt}>
                    {formatDate(post.updatedAt)}
                  </time>
                  <span className="text-xs text-muted-foreground">&bull;</span>
                  <span>{post.likes + " likes"}</span>
                </div>
                <div className="inline-flex gap-2">
                  <Badge variant="secondary">
                    {toSentenceCase(post.category)}
                  </Badge>
                  {post.isPremium && (
                    <Badge className="bg-yellow-600">Premium</Badge>
                  )}
                </div>
              </div>
            </article>
          ))}
          {(isLoading || isLoadingMore) &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <article
                key={i}
                className="flex gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
              >
                <div className="flex w-full flex-col gap-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="aspect-[16/10] min-w-[180px]" />
              </article>
            ))}
          {!isLoadingMore && !isReachingEnd && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSize(size + 1)}
            >
              Load more
            </Button>
          )}
        </div>
      </section>
      <aside className="sticky top-[-160px] col-span-4 w-full space-y-4">
        <Card className="flex flex-col items-center gap-7 p-6">
          <StarFilledIcon className="h-14 w-14 text-yellow-600" />
          <span className="text-center">
            Enjoy premium content by subscribing to a premium plan
          </span>
          <div className="space-x-2">
            <Button>Upgrade Now</Button>
            <Button variant="outline">Explore Plans</Button>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Trending Posts</CardTitle>
          </CardHeader>
          <TrendingPosts />
        </Card>
        <footer className="h-56 rounded-lg bg-muted p-6">footer</footer>
      </aside>
    </Shell>
  )
}

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <RootLayout>{page}</RootLayout>
}
