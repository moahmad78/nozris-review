"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    address: z.string().optional(),
    // Image handling usually involves upload elsewhere, here we just expect a string URL or skip it for now
});

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
    };

    const validated = profileSchema.safeParse(data);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: validated.data.name,
                email: validated.data.email,
                phone: validated.data.phone,
                address: validated.data.address
            }
        });

        revalidatePath("/dashboard/settings/profile");
        return { success: true };
    } catch (error) {
        console.error("Profile update error:", error);
        return { error: "Failed to update profile" };
    }
}
