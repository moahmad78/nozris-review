import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: (process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? "").trim(),
            clientSecret: (process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? "").trim(),
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile https://www.googleapis.com/auth/business.manage",
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === "production"
            }
        }
    },
    callbacks: {
        async jwt({ token, user, trigger, session }: { token: any, user?: any, trigger?: string, session?: any }) {
            // FORCE ADMIN & AUTO-ORG LOGIC FOR DEMO/DEV
            // This ensures the user always has access and an organization
            if (token.sub) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { organizationId: true, role: true, email: true }
                });

                if (dbUser) {
                    token.organizationId = dbUser.organizationId;
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.organizationId = token.organizationId as string | undefined;
                session.user.role = token.role as string | undefined;
            }
            return session;
        },
    }
});
