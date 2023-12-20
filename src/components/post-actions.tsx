import React from "react"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import {
  DotsVerticalIcon,
  HeartFilledIcon,
  HeartIcon,
  Link1Icon,
  Share1Icon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons"
import toast from "react-hot-toast"
import useSWR from "swr"

import type { Post } from "@/types/api"
import { fetcher } from "@/lib/fetchers"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface PostActionsProps {
  post: Post
}

export function PostActions({ post }: PostActionsProps) {
  const [isLiking, setIsLiking] = React.useState(false)
  const user = useStore((state) => state.user)

  const { data, mutate } = useSWR<Post>(`/posts/${post.id}`)
  const { likers, shareCount } = data ?? post

  const handleLike = async () => {
    if (!user || isLiking) return

    setIsLiking(true)
    await mutate(
      fetcher<Post>(`/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likers: likers.includes(user.id)
            ? likers.filter((id) => id !== user.id)
            : [...likers, user.id],
        }),
      }),
      {
        revalidate: false,
        populateCache: true,
      },
    )
    setIsLiking(false)
  }

  const incrementShareCount = async () => {
    await mutate(
      fetcher<Post>(`/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shareCount: shareCount + 1,
        }),
      }),
      {
        optimisticData: {
          ...post,
          shareCount: shareCount + 1,
        },
        revalidate: false,
        populateCache: true,
      },
    )
  }

  return (
    <div className="flex items-center rounded-full border p-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full", isLiking && "cursor-wait")}
        onClick={handleLike}
      >
        {user && likers.includes(user.id) ? (
          <HeartFilledIcon className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5" />
        )}
      </Button>
      <span className="mr-2 tabular-nums">{likers.length}</span>

      <Separator orientation="vertical" className="mx-2 my-auto h-5" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share1Icon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" forceMount>
          <DropdownMenuItem asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-full justify-start font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_APP_URL}/${post.slug}`,
                )
                toast.success("Copied to clipboard")

                await incrementShareCount()
              }}
            >
              <Link1Icon className="mr-2 h-4 w-4" aria-hidden="true" /> Copy
              link
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
                asChild
              >
                <a
                  href={`https://twitter.com/intent/tweet?text=${process.env.NEXT_PUBLIC_APP_URL}/${post.slug}`}
                  onClick={incrementShareCount}
                  target="_blank"
                >
                  <TwitterLogoIcon className="mr-2 h-4 w-4" /> Twitter
                </a>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="mr-2 tabular-nums">{shareCount}</span>

      <Separator orientation="vertical" className="mx-2 my-auto h-5" />

      <Button variant="ghost" size="icon" className="rounded-full">
        <DotsVerticalIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}
