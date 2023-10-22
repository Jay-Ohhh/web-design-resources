/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { serverSchema, formatErrors } from "./schema.mjs";
import { env as clientEnv } from "./client.mjs";

const serverEnv = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    /**
     * VERCEL_URL doesn't include `https://` so it cant be validated as a URL
     * 
     * @see https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables
     */
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    CLIENT_EMIAL: process.env.CLIENT_EMIAL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
};

const _serverEnv = serverSchema.safeParse(serverEnv);

if (!_serverEnv.success) {
    console.error(
        "❌ Invalid environment variables:\n",
        ...formatErrors(_serverEnv.error.format()),
    );
    throw new Error("Invalid environment variables");
}

for (let key of Object.keys(_serverEnv.data)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
        console.warn("❌ You are exposing a server-side env-variable:", key);

        throw new Error("You are exposing a server-side env-variable");
    }
}

export const env = { ..._serverEnv.data, ...clientEnv };