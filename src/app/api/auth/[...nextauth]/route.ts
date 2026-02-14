import { handlers } from "@/auth"; // Referring to src/auth.ts

import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    console.log("Auth Route: GET Request Received");
    console.log("Auth Route: AUTH_GOOGLE_ID Present:", !!process.env.AUTH_GOOGLE_ID);
    console.log("Auth Route: AUTH_SECRET Present:", !!process.env.AUTH_SECRET);
    return handlers.GET(req);
}

export const POST = async (req: NextRequest) => {
    console.log("Auth Route: POST Request Received");
    return handlers.POST(req);
}
