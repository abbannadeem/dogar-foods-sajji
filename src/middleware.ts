import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";

export const config = {
  // Only run middleware on admin routes. Login page is excluded so users can reach it.
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow access to the login page itself + login API.
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    // Preserve where the user was trying to go so we can redirect back after login.
    if (pathname !== "/admin") url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
