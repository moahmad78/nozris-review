import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

console.log("Auth Debug: Loading NextAuth...");
console.log("Auth Debug: AUTH_GOOGLE_ID Present:", !!process.env.AUTH_GOOGLE_ID);
console.log("Auth Debug: GOOGLE_CLIENT_ID Present:", !!process.env.GOOGLE_CLIENT_ID);
console.log("Auth Debug: AUTH_SECRET Present:", !!process.env.AUTH_SECRET);
console.log("Auth Debug: NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID?.trim() || process.env.GOOGLE_CLIENT_ID?.trim(),
            clientSecret: process.env.AUTH_GOOGLE_SECRET?.trim() || process.env.GOOGLE_CLIENT_SECRET?.trim(),
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
