import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/login";

  if (isApiAuthRoute) return NextResponse.next();

  if (isAdminRoute) {
    if (isLoggedIn && req.auth?.user?.role === "admin") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoginRoute && isLoggedIn && req.auth?.user?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
