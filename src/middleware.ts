import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Paths that should never be blocked or redirected by middleware
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicApiRoute =
    nextUrl.pathname.startsWith("/api") && !nextUrl.pathname.startsWith("/api/admin");
  const isNextInternal =
    nextUrl.pathname.startsWith("/_next") || nextUrl.pathname === "/favicon.ico";

  if (isApiAuthRoute || isPublicApiRoute || isNextInternal) {
    return NextResponse.next();
  }

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/login";

  // Case 1: Trying to access Admin area
  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== "admin") {
      const loginUrl = new URL("/login", nextUrl.origin);
      // Optional: append the current path so we can redirect back after login
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Case 2: Already logged in as Admin, trying to see Login page
  if (isLoginRoute && isLoggedIn && userRole === "admin") {
    return NextResponse.redirect(new URL("/admin", nextUrl.origin));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
