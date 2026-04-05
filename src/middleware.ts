import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isLoginPage = nextUrl.pathname === "/login";

  // Only handle redirecting logged-in admins AWAY from the login page.
  // We will let the AdminLayout handle the security of the /admin routes
  // to prevent infinite redirect loops between Middleware and Server Components.
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
