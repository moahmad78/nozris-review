import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    // Matcher disabled for development/demo to bypass strict auth checks
    // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
    matcher: [],
};
