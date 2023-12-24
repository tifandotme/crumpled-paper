import React from "react"
import { useRouter } from "next/router"
import {
  FileIcon,
  FilePlusIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import useSWR from "swr"

import type { Post } from "@/types/api"
import { cn, isMacOS } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"

export function SearchCommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 500)

  const { data: posts, isLoading } = useSWR<Post[]>(
    debouncedQuery.length ? `/posts?q=${debouncedQuery}` : null,
  )

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setOpen(false)
    callback()
  }, [])

  React.useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 md:h-10 md:w-60 md:justify-start md:px-3 md:py-2"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline-flex">Search posts...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 md:flex">
          <abbr
            title={isMacOS() ? "Command" : "Control"}
            className="no-underline"
          >
            {isMacOS() ? "⌘" : "Ctrl"}
          </abbr>
          K
        </kbd>
      </Button>
      <CommandDialog position="top" open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search posts..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isLoading ? "hidden" : "py-6 text-center text-sm")}
          >
            No posts found.
          </CommandEmpty>
          {isLoading ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            posts?.map((post) => (
              <CommandItem
                key={post.id}
                value={post.slug}
                onSelect={() => {
                  handleSelect(() => router.push(`/${post.slug}`))
                }}
                className="!py-3"
              >
                {post.isPremium ? (
                  <FilePlusIcon className="mr-2.5 h-4 w-4 shrink-0 text-accent-premium" />
                ) : (
                  <FileIcon className="mr-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate">{post.title}</span>
                <Badge variant="outline" className="ml-2.5">
                  {post.category}
                </Badge>
              </CommandItem>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
