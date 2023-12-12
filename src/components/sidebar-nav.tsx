import Link from "next/link"
import { useRouter } from "next/router"
import { ChevronRightIcon } from "@radix-ui/react-icons"

import { dashboardConfig } from "@/config"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"

export interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ ...props }: SidebarNavProps) {
  const pathname = useRouter().pathname

  const user = useStore((state) => state.user)

  return (
    <div className="flex w-full flex-col gap-2 p-1" {...props}>
      {dashboardConfig.sidebarNav.map((item) => {
        const Icon = item.icon ? Icons[item.icon] : ChevronRightIcon

        return (
          <Link aria-label={item.title} key={item.title} href={item.href}>
            <span
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",

                pathname.includes(item.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{item.title}</span>
            </span>
          </Link>
        )
      })}
      {user?.role === "admin" && (
        <>
          <Separator />
          {dashboardConfig.sidebarNavAdmin.map((item) => {
            const Icon = item.icon ? Icons[item.icon] : ChevronRightIcon

            return (
              <Link aria-label={item.title} key={item.title} href={item.href}>
                <span
                  className={cn(
                    "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",

                    pathname.includes(item.href)
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          })}
        </>
      )}
    </div>
  )
}
