"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { GoogleBusinessService } from "@/lib/google-business";
import { revalidatePath } from "next/cache";

export async function updateReviewDraft(reviewId: string, draftText: string) {
    const session = await auth();
    if (!session?.user?.organizationId) return { error: "Unauthorized" };

    try {
        // Verify review belongs to org
        const review = await prisma.review.findFirst({
            where: {
                id: reviewId,
                location: { organizationId: session.user.organizationId }
            }
        });

        if (!review) return { error: "Review not found" };

        await prisma.review.update({
            where: { id: reviewId },
            data: {
                aiDraftReply: draftText,
                // If it was pending, now it's drafted/edited? 
                // Let's keep status as DRAFT_CREATED or maybe modify to DRAFT_EDITED if strictly needed
                // But for now, DRAFT_CREATED is fine to mean "Prepared".
            }
        });

        revalidatePath("/dashboard/reviews");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update draft" };
    }
}

export async function postReviewReply(reviewId: string, replyText: string) {
    const session = await auth();
    if (!session?.user?.id || !session.user.organizationId) return { error: "Unauthorized" };

    try {
        const review = await prisma.review.findFirst({
            where: {
                id: reviewId,
                location: { organizationId: session.user.organizationId }
            },
            include: { location: true }
        });

        if (!review) return { error: "Review not found" };

        // Post to Google
        const googleService = new GoogleBusinessService();
        await googleService.init(session.user.id);

        // review.googleReviewId is the resource name e.g. "accounts/.../reviews/..."
        await googleService.replyToReview(review.googleReviewId, replyText);

        // Update DB
        await prisma.review.update({
            where: { id: reviewId },
            data: {
                status: "POSTED",
                finalReply: replyText,
                aiDraftReply: null // clear draft or keep it? user might want history. Let's keep it.
            }
        });

        revalidatePath("/dashboard/reviews");
        return { success: true };

    } catch (error: any) {
        console.error("Post Reply Error:", error);
        return { error: error.message || "Failed to post reply to Google" };
    }
}
