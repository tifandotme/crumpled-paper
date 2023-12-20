import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { DashboardIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons"
import toast from "react-hot-toast"

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

export function SiteHeader() {
  const router = useRouter()

  const { user, loading } = useStore((state) => state)
  const updateUser = useStore((state) => state.updateUser)

  const onLogout = async () => {
    removeCookie("role")
    removeCookie("token")

    await router.push("/signin")

    updateUser(null)

    toast.success("Logged out successfully")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {loading && (
              <Skeleton className="h-8 w-8 rounded-full" aria-hidden="true" />
            )}
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
                        <DashboardIcon
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/billing"
                        className="cursor-pointer"
                      >
                        <Icons.CreditCard
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/account"
                        className="cursor-pointer"
                      >
                        <GearIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button
                      onClick={onLogout}
                      className="w-full cursor-pointer"
                    >
                      <ExitIcon className="mr-2 h-4 w-4" aria-hidden="true" />
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
