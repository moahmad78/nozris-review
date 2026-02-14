"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Fake/Demo notifications if empty
        if (notifications.length === 0) {
            return [
                { id: '1', title: 'New 5-star review', message: 'Toyota Showroom received a new 5-star review.', isRead: false, createdAt: new Date() },
                { id: '2', title: 'AI Draft Ready', message: 'Draft reply generated for "Bad service" review.', isRead: false, createdAt: new Date(Date.now() - 3600000) },
                { id: '3', title: 'Weekly Summary', message: 'You received 12 new reviews this week.', isRead: true, createdAt: new Date(Date.now() - 86400000) }
            ];
        }

        return notifications;
    } catch (error) {
        console.error("Get notifications error:", error);
        return [];
    }
}

export async function markAllRead() {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true }
    });

    revalidatePath("/dashboard");
}
