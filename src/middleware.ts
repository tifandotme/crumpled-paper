import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const role = request.cookies.get("role")?.value

  const currPath = request.nextUrl.pathname
  const currOrigin = request.nextUrl.origin

  if (["/signup", "/signin"].includes(currPath) && token) {
    return NextResponse.redirect(currOrigin)
  }

  if (currPath.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(currOrigin + "/signin")
  }

  // prettier-ignore
  if (["/dashboard/posts", "/dashboard/users"].includes(currPath) && role !== "admin") {
    return NextResponse.redirect(currOrigin)
  }

  if (currPath === "/dashboard") {
    return NextResponse.redirect(currOrigin + "/dashboard/account")
  }

  if (currPath === "/dashboard/users") {
    return NextResponse.redirect(currOrigin + "/dashboard/users/subscriptions")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/signup/:path*", "/signin/:path*", "/dashboard/:path*"],
}
