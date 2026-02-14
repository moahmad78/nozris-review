import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }: { auth: any; request: { nextUrl: URL } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding");

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // If user is logged in but hasn't completed onboarding (no org), 
                // and is trying to access dashboard, we might want to redirect.
                // But we can't easily check orgId here without it being in the session.
                // We will assume that handled by the page logic or refined later.

                // For now, let's just keep the basic protection.
                if (nextUrl.pathname === "/login") {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
                return true;
            }
            return true;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
