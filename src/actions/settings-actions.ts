"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrganizationSettings(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !session.user.organizationId) {
        return { error: "Unauthorized" };
    }

    const preferredTone = formData.get("preferredTone") as string;
    const autoReplyEnabled = formData.get("autoReplyEnabled") === "on";

    try {
        await prisma.organization.update({
            where: { id: session.user.organizationId },
            data: {
                preferredTone,
                autoReplyEnabled
            } as any
        });
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating settings:", error);
        return { error: "Failed to update settings" };
    }
}
