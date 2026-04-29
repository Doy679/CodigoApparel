export { auth as proxy } from "./auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|css|js|map)$).*)"
  ]
};
