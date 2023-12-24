import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  DiscordLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  MagnifyingGlassIcon,
  StarFilledIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons"
import useSWRInfinite from "swr/infinite"

import type { Post } from "@/types/api"
import {
  footerLinks,
  postCategories,
  siteConfig,
  type PostCategories,
} from "@/config"
import { useStore } from "@/lib/store"
import {
  cn,
  formatDate,
  getBase64,
  toSentenceCase,
  updateQueryParams,
} from "@/lib/utils"
import { useIntersection } from "@/hooks/use-intersection"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Toggle } from "@/components/ui/toggle"
import { HomeLayout } from "@/components/layouts/home"
import { Shell } from "@/components/shell"
import { TrendingPosts } from "@/components/trending-posts"

type QueryParams = {
  page: string
  sort: "asc" | "desc"
  category: PostCategories | null
  premium: "true" | "false"
}

export const getServerSideProps: GetServerSideProps<QueryParams> = async (
  context,
) => {
  const queryParams = context.query as QueryParams

  const page = queryParams.page ?? "1"
  const sort = queryParams.sort ?? "desc"
  const category = queryParams.category ?? null
  const premium = queryParams.premium ?? "false"

  return {
    props: {
      page,
      sort,
      category,
      premium,
    },
  }
}

const PAGE_SIZE = 10

export default function HomePage({
  page: initialPage,
  sort: initialSort,
  category: initialCategory,
  premium: initialPremium,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const { sort, category, premium } = router.query as Partial<QueryParams>

  const [categoryState, setCategoryState] = React.useState(initialCategory)
  const [premiumState, setPremiumState] = React.useState(initialPremium)
  const [sortState, setSortState] = React.useState(initialSort)

  const { data, isLoading, size, setSize } = useSWRInfinite<Post[]>(
    (idx) => {
      const params = new URLSearchParams()
      if (categoryState) params.set("category", categoryState)
      if (premiumState === "true") params.set("isPremium", "true")
      params.set("_sort", "updatedAt")
      params.set("_order", sortState)
      params.set("_page", String(idx + 1))
      params.set("_limit", String(PAGE_SIZE))

      return `/posts?${params.toString()}}`
    },
    {
      initialSize: Number(initialPage),
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

    updateQueryParams(router, { page: String(size) })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])

  React.useEffect(() => {
    if (!sort || sort === sortState) return

    setSortState(sort)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  React.useEffect(() => {
    if (category === undefined || category === categoryState) return

    setCategoryState(category)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  React.useEffect(() => {
    if (!premium || premium === premiumState) return

    setPremiumState(premium)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premium])

  return (
    <Shell className="flex max-w-screen-lg items-start gap-10 px-14 xl:grid xl:max-w-screen-xl xl:grid-cols-12">
      <section className="col-span-8 w-full">
        <Card className="mb-4 block xl:hidden">
          <CardHeader>
            <CardTitle className="text-xl">Trending Posts</CardTitle>
          </CardHeader>
          <TrendingPosts />
        </Card>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="data-[state=open]:bg-accent"
              >
                <span>Date</span>
                {sortState === "desc" ? (
                  <ArrowDownIcon className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpIcon className="ml-2 h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => updateQueryParams(router, { sort: "asc" })}
              >
                <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => updateQueryParams(router, { sort: "desc" })}
              >
                <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Desc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "data-[state=open]:bg-accent",
                  categoryState && "bg-accent",
                )}
              >
                <span>
                  {categoryState ? toSentenceCase(categoryState) : "Category"}
                </span>
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {postCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => updateQueryParams(router, { category })}
                >
                  {toSentenceCase(category)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => updateQueryParams(router, { category: null })}
                className="text-destructive"
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Toggle
            size="lg"
            className="border px-8 hover:text-foreground data-[state=on]:text-yellow-500"
            defaultPressed={premiumState === "true"}
            onPressedChange={(state) =>
              updateQueryParams(router, { premium: String(state) })
            }
          >
            <span>Premium Only</span>
          </Toggle>
        </div>

        <div className="lg:space-y-4">
          {posts.map((post, idx) => (
            <React.Fragment key={post.id}>
              {idx % PAGE_SIZE === 0 && idx !== 0 && (
                <div className="relative border-b border-border/80">
                  <div className="absolute left-1/2 top-[-1rem] -translate-x-1/2 bg-background p-2 text-xs uppercase leading-[1rem] tracking-wider text-muted-foreground">
                    Page {idx / PAGE_SIZE + 1}
                  </div>
                </div>
              )}
              <Link key={post.id} href={`/${post.slug}`} className="block">
                <article
                  className={cn(
                    "flex flex-col gap-4 border-b bg-card px-2 py-6 text-card-foreground lg:rounded-lg lg:border lg:p-6 lg:shadow-sm",
                    idx === posts.length - 1 && "mb-2 border-0",
                  )}
                >
                  <div className="flex flex-col-reverse gap-4 md:flex-row">
                    <div className="w-full">
                      <h2 className="mb-2 text-xl font-bold tracking-tight lg:text-2xl">
                        {post.title}
                      </h2>
                      <p className="line-clamp-3">{post.content}</p>
                    </div>
                    <div className="min-w-[180px]">
                      <AspectRatio ratio={16 / 10}>
                        <Image
                          className="aspect-[16/10] rounded-lg object-cover"
                          width={1600}
                          height={1000}
                          src={post.image}
                          alt={"Post image of " + post.title}
                          placeholder={`data:image/svg+xml;base64,${getBase64(
                            180,
                            112.5,
                          )}`}
                          sizes="(max-width: 768px) 90vw, 33vw"
                          quality={85}
                          loading="lazy"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-4 text-muted-foreground md:flex-row">
                    <div className="inline-flex items-center gap-2">
                      <time dateTime={post.updatedAt}>
                        {formatDate(post.updatedAt)}
                      </time>
                      <span className="text-xs text-muted-foreground">
                        &bull;
                      </span>
                      <span>{post.likers.length + " likes"}</span>
                    </div>
                    <div className="inline-flex gap-2">
                      <Badge variant="secondary">
                        {toSentenceCase(post.category)}
                      </Badge>
                      {post.isPremium && (
                        <Badge className="bg-accent-premium hover:bg-accent-premium/80">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </React.Fragment>
          ))}
          {(isLoading || isLoadingMore) &&
            Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <article
                key={idx}
                className="flex flex-col-reverse gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm md:flex-row"
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

      <Sidebar />
    </Shell>
  )
}

const Sidebar = React.memo(function Sidebar() {
  const { user, loading } = useStore(({ user, loading }) => ({ user, loading }))

  const footerRef = React.useRef<HTMLDivElement | null>(null)
  const sidebarRef = React.useRef<HTMLDivElement | null>(null)

  const intersection = useIntersection(footerRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  })

  const [isSticky, setIsSticky] = React.useState(false)
  const top = React.useRef(0)

  React.useEffect(() => {
    if (!intersection) return

    if (intersection.intersectionRatio >= 1) {
      setIsSticky(true)

      const windowHeight = window.innerHeight ?? 0
      const sidebarHeight = sidebarRef.current?.offsetHeight ?? 0

      /**
       * This determine whether the sticky sidebar will stick to the bottom or top of the page,
       * depending on whether the sidebar is partially in view or not.
       *
       * 64px comes from header height, 32px comes from paddingY of Shell component in MainPage
       */
      if (windowHeight - 150 < sidebarHeight) {
        top.current = windowHeight - sidebarHeight - 32
      } else {
        top.current = 64 + 32
      }
    } else {
      setIsSticky(false)
    }
  }, [intersection])

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "col-span-4 hidden w-full space-y-4 xl:block",
        isSticky && "sticky",
      )}
      style={{ top: top.current }}
    >
      {!loading && !user?.subscription.isSubscribed && (
        <Card className="flex flex-col items-center gap-6 p-6">
          <div className="flex items-center">
            <StarFilledIcon className="h-20 w-20 translate-x-6 text-accent-premium" />
            <MagnifyingGlassIcon className="h-20 w-20 -translate-x-6" />
          </div>
          <span className="text-center">
            Enjoy more perks: Subscribe to our premium plan today.
          </span>
          <div className="space-x-2">
            <Button asChild>
              <Link href="/dashboard/billing">Upgrade Now</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/billing">Explore Plans</Link>
            </Button>
          </div>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recommended Topics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {postCategories
            .filter((category) => category !== "uncategorized")
            .map((category) => (
              <Link key={category} href={`?category=${category}`}>
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-sm font-medium"
                >
                  {toSentenceCase(category)}
                </Badge>
              </Link>
            ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Trending Posts</CardTitle>
        </CardHeader>
        <TrendingPosts />
      </Card>
      <footer ref={footerRef} className="rounded-lg bg-muted p-6">
        <div className="grid grid-cols-2 gap-y-2 first:[&>h3]:mt-0">
          {footerLinks.map(({ title: heading, links }) => (
            <React.Fragment key={heading}>
              <h3 className="col-span-2 mt-5 font-medium">{heading}</h3>
              {links.map(({ title, href }) => (
                <a
                  key={title}
                  href={href}
                  className="text-sm text-foreground/90 hover:underline"
                >
                  {title}
                </a>
              ))}
            </React.Fragment>
          ))}

          <h3 className="col-span-2 mt-5 font-medium">Connect with us</h3>
          <div className="col-span-2 space-x-5">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-accent hover:bg-background"
            >
              <TwitterLogoIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-accent hover:bg-background"
            >
              <LinkedInLogoIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-accent hover:bg-background"
            >
              <InstagramLogoIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-accent hover:bg-background"
            >
              <DiscordLogoIcon className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="col-span-2 my-4" />
          <div className="col-span-2 space-x-2 text-sm">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span className="select-none text-xs text-muted-foreground">
              &bull;
            </span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <span className="select-none text-xs text-muted-foreground">
              &bull;
            </span>
            <span className="text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
          </div>
        </div>
      </footer>
    </aside>
  )
})

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <HomeLayout>{page}</HomeLayout>
}
