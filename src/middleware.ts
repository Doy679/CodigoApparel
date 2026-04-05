import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  console.log("Middleware check:", {
    pathname: nextUrl.pathname,
    isLoggedIn,
    userRole
  });

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/login";

  // Case 1: If user is on an admin route and NOT logged in OR not an admin
  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== "admin") {
      console.log("Redirecting to /login from", nextUrl.pathname);
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  // Case 2: If user is on the login page and ALREADY logged in as admin
  // We'll comment this out for now to ensure we can at least reach the login page
  // without getting caught in a redirect loop if the session is partially valid.
  /*
  if (isLoginPage && isLoggedIn && userRole === "admin") {
    console.log("Redirecting to /admin from /login (already logged in)");
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }
  */

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
