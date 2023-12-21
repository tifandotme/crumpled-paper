import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"
import Image from "next/image"
import Link from "next/link"
import Balancer from "react-wrap-balancer"

import type { Post } from "@/types/api"
import { getPlaceholder } from "@/lib/plaiceholder"
import { useStore } from "@/lib/store"
import { formatDate, readingTime, toSentenceCase } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PostLayout } from "@/components/layouts/post"
import { PostActions } from "@/components/post-actions"
import { RecommendedPosts } from "@/components/recommended-posts"

export const getStaticPaths: GetStaticPaths = async () => {
  const url = new URL("/posts", process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url)

  const posts: Post[] = await res.json()

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<{
  post: Post
  placeholder: string | null
}> = async (context) => {
  const url = new URL(
    `/posts?slug=${context.params?.slug}`,
    process.env.NEXT_PUBLIC_DB_URL,
  )
  const res = await fetch(url)

  const post = (await res.json())[0] as Post | undefined

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: { post, placeholder: await getPlaceholder(post.image) },
  }
}

export default function PostPage({
  post,
  placeholder,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const user = useStore((state) => state.user)

  const content = post.content.split("\n")
  const isRestricted = !user?.subscription.isSubscribed && post.isPremium

  return (
    <>
      <section className="mx-auto mb-10 flex max-w-screen-md lg:max-w-screen-lg">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={post.image}
            alt={post.title}
            width={1600}
            height={1000}
            placeholder={placeholder ? "blur" : "empty"}
            blurDataURL={placeholder ?? undefined}
            quality={90}
            className="absolute z-10 aspect-[16/9] object-cover"
          />
        </AspectRatio>
      </section>

      <section className="container mb-10 max-w-screen-md space-y-7 lg:max-w-screen-lg">
        {post.isPremium && (
          <div className="text-center">
            <Badge className="bg-accent-premium text-sm hover:bg-accent-premium/80">
              Premium
            </Badge>
          </div>
        )}

        <div className="mb-10 mt-0 w-full px-2 text-center md:px-10">
          <Balancer
            as="h1"
            className="text-center text-3xl font-bold md:text-4xl lg:text-5xl"
          >
            {post.title}
          </Balancer>
        </div>

        <div className="flex w-full items-center justify-center gap-2 text-muted-foreground">
          <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
          <span className="select-none text-xs text-muted-foreground">
            &bull;
          </span>
          <span>{readingTime(post.content)} min read</span>
          <span className="select-none text-xs text-muted-foreground">
            &bull;
          </span>
          <Badge variant="outline">{toSentenceCase(post.category)}</Badge>
        </div>
      </section>

      <section className="container mb-10 max-w-screen-md lg:max-w-[900px]">
        {(isRestricted
          ? content.slice(0, Math.floor(content.length / 2))
          : content
        ).map((paragraph) => (
          <p
            key={paragraph.slice(0, 20)}
            className="mb-4 text-lg !leading-relaxed lg:text-xl"
          >
            {paragraph}
          </p>
        ))}
        {isRestricted && (
          <div className="z-10 -translate-y-24 space-y-10 bg-gradient-to-t from-background from-60% to-transparent to-100% px-20 pb-5 pt-28 text-center">
            <p className="text-lg font-semibold">
              Don&apos;t miss out on premium contents written by the best
              authors in the world, only for subscribed users.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard/billing">Subscribe Now</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="container mb-10 flex max-w-screen-md justify-center">
        <PostActions post={post} />
      </section>

      <RecommendedPosts currPostId={post.id} />
    </>
  )
}

PostPage.getLayout = function getLayout(page: React.ReactElement) {
  return <PostLayout>{page}</PostLayout>
}
