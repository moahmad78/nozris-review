"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createOrganization(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const name = formData.get("orgName") as string;
    const website = formData.get("website") as string;

    if (!name || name.length < 3) {
        return { error: "Organization name must be at least 3 characters" };
    }

    try {
        // Create Org
        const org = await prisma.organization.create({
            data: {
                name,
                website,
                preferredTone: "Professional", // Default
                autoReplyEnabled: false
            } as any
        });

        // Link User to Org
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                organizationId: org.id,
                role: "SUPER_ADMIN" // Promote creator to Admin
            }
        });

    } catch (error) {
        console.error("Onboarding error:", error);
        return { error: "Failed to create organization" };
    }

    redirect("/dashboard/settings");
}
