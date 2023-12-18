import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
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

export const getServerSideProps: GetServerSideProps<{
  page: string
  sort: "asc" | "desc"
}> = async (context) => {
  const page = (context.query?.page as string) ?? "1"
  const sort = (context.query?.sort as "asc" | "desc") ?? "desc"

  return {
    props: {
      page,
      sort,
    },
  }
}

const PAGE_SIZE = 10

export default function HomePage({
  page,
  sort,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(sort)

  const { data, isLoading, size, setSize, mutate } = useSWRInfinite(
    (idx) => {
      const params = new URLSearchParams()
      params.set("_sort", "id")
      params.set("_order", sortOrder)
      params.set("_page", String(idx + 1))
      params.set("_limit", String(PAGE_SIZE))

      return `/posts?${params.toString()}}`
    },
    fetcher<Post[]>,
    {
      initialSize: Number(page),
      revalidateOnFocus: false,
      persistSize: true,
      parallel: true,
    },
  )

  const posts = data ? ([] as Post[]).concat(...data) : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && (data[data.length - 1]?.length ?? 0) < PAGE_SIZE)

  React.useEffect(() => {
    if (size === 1) return

    router.replace(
      {
        query: {
          ...router.query,
          page: size,
        },
      },
      undefined,
      { shallow: true, scroll: false },
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])

  React.useEffect(() => {
    if (router.query.sort === undefined) return
    if (router.query.sort === sortOrder) return

    setSortOrder(router.query.sort as "asc" | "desc")

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.sort])

  console.log(sortOrder)

  return (
    <Shell className="max-w-screen-xl grid-cols-12 items-start gap-10 px-14">
      <section className="col-span-8">
        <div className="mb-4 space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="data-[state=open]:bg-accent">
                <span>Date</span>
                {sortOrder === "desc" ? (
                  <ArrowDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                ) : (
                  <ArrowUpIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        sort: "asc",
                      },
                    },
                    undefined,
                    { shallow: true, scroll: false },
                  )
                }}
              >
                <ArrowUpIcon
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        sort: "desc",
                      },
                    },
                    undefined,
                    { shallow: true, scroll: false },
                  )
                }}
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
          {posts.map((post, i) => (
            <>
              {i % PAGE_SIZE === 0 && i !== 0 && (
                <div className="relative border-b border-border/80">
                  <div className="absolute left-1/2 top-[-1rem] -translate-x-1/2 bg-background p-2 text-xs uppercase leading-[1rem] tracking-wider text-muted-foreground">
                    Page {i / PAGE_SIZE + 1}
                  </div>
                </div>
              )}
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
                    <span className="text-xs text-muted-foreground">
                      &bull;
                    </span>
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
            </>
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
