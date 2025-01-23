import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value
  const { pathname } = request.nextUrl

  // Allow access to home, signup, and signin pages
  if (pathname === "/" || pathname === "/signup" || pathname === "/signin") {
    return NextResponse.next()
  }

  // Redirect to signin if not authenticated
  if (!authToken) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  // Allow access to all other routes if authenticated
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

