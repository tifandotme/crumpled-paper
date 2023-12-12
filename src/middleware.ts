import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const role = request.cookies.get("role")?.value

  if (["/signup", "/signin"].includes(request.nextUrl.pathname) && token) {
    return NextResponse.redirect(request.nextUrl.origin)
  }

  if (request.nextUrl.pathname.startsWith("/dashboard") && role !== "admin") {
    return NextResponse.redirect(request.nextUrl.origin)
  }

  if (request.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(request.nextUrl.origin + "/dashboard/account")
  }

  if (request.nextUrl.pathname === "/dashboard/users") {
    return NextResponse.redirect(
      request.nextUrl.origin + "/dashboard/users/subscriptions",
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/signup/:path*", "/signin/:path*", "/dashboard/:path*"],
}
