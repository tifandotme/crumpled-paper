import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"
import Image from "next/image"
import { ImageIcon } from "@radix-ui/react-icons"
import Balancer from "react-wrap-balancer"

import type { Post } from "@/types/api"
import { formatDate, readingTime, toSentenceCase } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { RootLayout } from "@/components/layouts/root"
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

export const getStaticProps: GetStaticProps<{ post: Post }> = async (
  context,
) => {
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
    props: { post },
  }
}

export default function PostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <section className="mx-auto mb-10 flex max-w-screen-md lg:max-w-screen-lg">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={post.image}
            alt={post.title}
            width={1600}
            height={1000}
            className="absolute z-10 aspect-[16/9] object-cover"
          />
          {/* TODO display only when image failed to load */}
          <div className="absolute flex h-full w-full items-center justify-center bg-muted">
            <ImageIcon className="h-20 w-20 text-muted-foreground" />
          </div>
        </AspectRatio>
      </section>

      <section className="container mb-10 max-w-screen-md space-y-7 lg:max-w-screen-lg">
        {post.isPremium && (
          <div className="text-center">
            <Badge className="bg-yellow-600 text-sm hover:bg-yellow-700">
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
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-4 text-lg !leading-relaxed lg:text-xl">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="container mb-10 flex max-w-screen-md justify-center">
        <PostActions post={post} />
      </section>

      <RecommendedPosts currPostId={post.id} />
    </>
  )
}

PostPage.getLayout = function getLayout(page: React.ReactElement) {
  return <RootLayout>{page}</RootLayout>
}
