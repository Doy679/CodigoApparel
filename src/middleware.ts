import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/login";

  // Case 1: If user is on an admin route and NOT logged in OR not an admin
  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  // Case 2: If user is on the login page and ALREADY logged in as admin
  if (isLoginPage && isLoggedIn && userRole === "admin") {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
