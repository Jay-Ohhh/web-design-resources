import { clientSchema, formatErrors } from "./schema.mjs";

export const clientEnv = {
    NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
    NEXT_PUBLIC_BLOG_URL: process.env.NEXT_PUBLIC_BLOG_URL,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
};

const _clientEnv = clientSchema.safeParse(clientEnv);

if (!_clientEnv.success) {
    console.error(
        "❌ Invalid environment variables:\n",
        ...formatErrors(_clientEnv.error.format()),
    );

    throw new Error("Invalid environment variables");
}

for (let key of Object.keys(_clientEnv.data)) {
    if (!key.startsWith("NEXT_PUBLIC_")) {
        console.warn(
            `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`,
        );

        throw new Error("Invalid public environment variable name");
    }
}

export const env = _clientEnv.data;