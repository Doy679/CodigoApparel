import { auth } from "./auth";

export default auth((req) => {
  // We are removing all redirect logic from here.
  // The redirection will now be handled EXCLUSIVELY by the Server Components (Layouts),
  // which is 100% stable and does not cause redirect loops.
  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
