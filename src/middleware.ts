// https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy
// https://nextjs.org/docs/pages/building-your-application/routing/middleware

// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from "next/server";
import generateCspHeader from "cspRequestHeader";

export function middleware() {
  const requestHeaders = new Headers();
  const [headerKey, headerContent] = generateCspHeader();
  requestHeaders.set(headerKey, headerContent);
  return NextResponse.next({
    headers: requestHeaders,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - This is copied straight from the docs 🤷‍♂️
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
