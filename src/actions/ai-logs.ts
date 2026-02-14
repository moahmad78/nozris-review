"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getAILogs() {
    const session = await auth();

    if (!session?.user?.id) {
        return [];
    }

    // Get organization
    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!dbUser?.organizationId) return [];

    try {
        const logs = await prisma.aIReplyLog.findMany({
            where: { organizationId: dbUser.organizationId },
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return logs;
    } catch (error) {
        console.error("Error fetching AI logs:", error);
        return [];
    }
}
