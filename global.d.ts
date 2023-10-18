interface UserSession extends import("next-auth").Session {
    user: import("next-auth").Session["user"] & {
        id: string;
        authType: import("next-auth/providers").ProviderType;
    };
};