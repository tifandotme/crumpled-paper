import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  CounterClockwiseClockIcon,
  DashboardIcon,
  ExitIcon,
} from "@radix-ui/react-icons"
import { toast } from "sonner"

import { siteConfig } from "@/config"
import avatarImg from "@/assets/images/avatar.webp"
import { removeCookie } from "@/lib/cookie"
import { useStore } from "@/lib/store"
import { Avatar } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { SearchCommandMenu } from "@/components/search-command-menu"

export function SiteHeader() {
  const router = useRouter()

  const { user, loading } = useStore(({ user, loading }) => ({ user, loading }))
  const updateUser = useStore((state) => state.updateUser)

  const onLogout = async () => {
    removeCookie("role")
    removeCookie("token")

    if (router.pathname.startsWith("/dashboard")) {
      await router.push("/signin")
    }

    updateUser(null)

    toast.success("Logged out successfully")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <MobileNav />

        <div className="hidden gap-6 md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.Logo className="h-6 w-6" />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <SearchCommandMenu />

          <nav className="flex items-center space-x-2">
            {loading && <Skeleton className="h-8 w-8 rounded-full" />}
            {!loading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-8 w-8 select-none rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <Image src={avatarImg} alt={user.name} priority />
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <DashboardIcon className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/billing"
                        className="cursor-pointer"
                      >
                        <Icons.CreditCard className="mr-2 h-4 w-4" />
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <CounterClockwiseClockIcon className="mr-2 h-4 w-4" />
                        Recently Read
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button
                      onClick={onLogout}
                      className="w-full cursor-pointer"
                    >
                      <ExitIcon className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!loading && !user && (
              <Link
                href="/signin"
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Sign In
                <span className="sr-only">Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
