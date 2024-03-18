import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const skipAuthPageRegExp = /^\/(login|register|resources(\/(?!add).*)?|tag(\/.*)?|search(\/.*)?|terms-and-conditions|privacy|user\/.*)?$/;

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api/, /trpc/ routes
         * 2. /_next/ (Next.js internals)
         * 3. /_proxy/, /_auth/ (special pages for OG tags proxying and password protection)
         * 4. /images/, /js/, /assets/ (inside /public)
         * 5. /_vercel (Vercel internals)
         * 6. /favicon.ico, /.*sitemap-index.xml, /.*sitemap.xml, /robots.txt (static files)
         * sitemap and robot.txt are generated by `next-sitemap`
         */
        "/((?!api/|trpc/|_next/|_vercel|images|js/|assets/|favicon.ico|.*sitemap-index.xml|.*sitemap.xml|robots.txt).*)",
    ],
};

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(request) {
        // console.log(request.nextauth.token);
        /**
         * @see https://github.com/vercel/next.js/issues/43704
         * @see https://nextjs.org/docs/app/api-reference/functions/next-response#next
         */
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-current-url", request.url);

        let ip = request.ip ?? request.headers.get("x-real-ip");
        const forwardedFor = request.headers.get("x-forwarded-for");

        if (!ip && forwardedFor) {
            ip = forwardedFor.split(",").at(0) ?? null;
            ip && requestHeaders.set("x-current-ip", ip);
        }

        return NextResponse.next({
            request: {
                // Apply new request headers
                headers: requestHeaders,
            }
        });
    },
    {
        callbacks: {
            authorized({ req, token }) {
                return skipAuthPageRegExp.test(req.nextUrl.pathname) || !!token;
            }
        },
    }
);