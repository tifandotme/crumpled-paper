import Link from "next/link"
import { ChevronLeftIcon } from "@radix-ui/react-icons"

import { dashboardConfig } from "@/config"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ ...props }: SidebarNavProps) {
  const items = dashboardConfig.sidebarNav

  if (!items.length) return null

  return (
    <div className="flex w-full flex-col gap-2 p-1" {...props}>
      {items.map((item) => {
        const Icon = item.icon ? Icons[item.icon] : ChevronLeftIcon

        return item.href ? (
          <Link
            aria-label={item.title}
            key={item.title}
            href={item.href}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <span
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",
                // item.href.includes(String(segment))
                "bg-muted font-medium text-foreground",
                // : "text-muted-foreground",

                item.disabled && "pointer-events-none opacity-60",
              )}
            >
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{item.title}</span>
            </span>
          </Link>
        ) : (
          <span
            key={item.title}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline"
          >
            {item.title}
          </span>
        )
      })}
    </div>
  )
}
