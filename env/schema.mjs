import { z } from "zod";

const requiredForProduction = () => process.env.NODE_ENV === "production"
    ? z.string().min(1).trim()
    : z.string().min(1).trim().optional();

/**
* Specify your client-side environment variables schema here.
* This way you can ensure the app isn't built with invalid env vars.
* To expose them to the client, prefix them with `NEXT_PUBLIC_`.
*/
export const clientSchema = z.object({
    NEXT_PUBLIC_NEXTAUTH_URL: z.preprocess(
        (str) => process.env.NEXT_PUBLIC_VERCEL_URL ?? str,
        process.env.NEXT_PUBLIC_VERCEL_URL ? z.string() : z.string().url()
    ),
});

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: requiredForProduction(),
    NEXTAUTH_URL: z.preprocess(
        // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
        // Since NextAuth.js automatically uses the VERCEL_URL if present.
        (str) => process.env.NEXT_PUBLIC_VERCEL_URL ?? str,
        /**
         * VERCEL_URL doesn't include `https://` so it cant be validated as a URL
         * 
         * @see https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables
         */
        process.env.NEXT_PUBLIC_VERCEL_URL ? z.string() : z.string().url()
    ),
    GOOGLE_CLIENT_ID: z.string().min(1).trim().optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).trim().optional(),
    GITHUB_CLIENT_ID: z.string().min(1).trim(),
    GITHUB_CLIENT_SECRET: z.string().min(1).trim(),
    GITHUB_TOKEN: z.string().min(1).trim(),
});

export const formatErrors = (
    /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
    errors,
) =>
    Object.entries(errors)
        .map(([name, value]) => {
            if (value && "_errors" in value)
                return `${name}: ${value._errors.join(", ")}\n`;
        })
        .filter(Boolean);
