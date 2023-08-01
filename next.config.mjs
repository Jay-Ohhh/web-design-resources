/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./env/server.mjs"));

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    async headers() {
        /**
         * @see https://nextjs.org/docs/app/api-reference/next-config-js/headers
         */
        return [
            {
                source: "/login",
                headers: [
                    {
                        /**
                         * This header indicates whether the site should be allowed to be displayed within an iframe. 
                         * This can prevent against clickjacking attacks. 
                         * This header has been superseded by CSP's frame-ancestors option, 
                         * which has better support in modern browsers.
                         */
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                ],
            },
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Referrer-Policy",
                        value: "no-referrer-when-downgrade",
                    },
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
