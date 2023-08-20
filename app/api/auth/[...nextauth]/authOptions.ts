import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env/server.mjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db";

const providers: NextAuthOptions["providers"] = [
    // CredentialsProvider({
    //     name: "Sign in",
    //     credentials: {
    //         email: {
    //             label: "Email",
    //             type: "email",
    //             placeholder: "hello@example.com",
    //         },
    //         password: {
    //             label: "Password",
    //             type: "password",
    //         }
    //     },
    //     async authorize(credentials) {
    //         if (!credentials?.email || !credentials.password) {
    //             return null;
    //         }

    //         const user = await prisma.user.findUnique({
    //             where: {
    //                 email: credentials.email,
    //             },
    //         });

    //         if (!user) {
    //             return null;
    //         }

    //         const decrypt = new JSEncrypt();
    //         decrypt.setPrivateKey(env.RSA_PRIVATE_KEY);
    //         const pwd = decrypt.decrypt(credentials.password) as string;

    //         if (!await bcrypt.compare(pwd, user.password!)) {
    //             return null;
    //         }

    //         // Any object returned will be saved in `user` property of the JWT
    //         // and will be pass to jwt callback
    //         return {
    //             id: user.id,
    //             email: user.email,
    //             name: user.name,
    //         };
    //     },
    // })
];

// Invalid in CN
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            httpOptions: {
                timeout: 10000,
            },
        })
    );
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            httpOptions: {
                timeout: 10000,
            },
        }),
    );
}

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    providers,
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: ({ session, token }) => {
            // The session callback is called whenever a session is checked.
            // e.g. getSession(), getServerSession(), useSession(), /api/auth/session
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    authType: token.authType,
                }
            };
        },
        // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client). 
        jwt: async ({ token, user, account, profile }) => {
            // token will be pass to session callback
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    authType: account?.type,
                };
            }

            return token;
        }
    },
};

export async function fetchServerSession() {
    return await getServerSession(authOptions) as UserSession | null;
}