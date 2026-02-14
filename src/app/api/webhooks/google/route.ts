import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateReviewReply } from "@/lib/openai";
import { GoogleBusinessService } from "@/lib/google-business";

// Google Webhook Secret (if verifying signature) - Skipping strict verification for demo
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Google Webhook Received:", JSON.stringify(body, null, 2));

        // Basic payload structure for New Review (check Google docs usually)
        // Usually contains `resourceName` which is the review ID
        // Payload example: { "notificationType": "NEW_REVIEW", "name": "accounts/.../reviews/..." }

        const { notificationType, name } = body;

        if (notificationType === "NEW_REVIEW" && name) {
            // "name" here is the full resource path of the review
            // e.g. accounts/{acc}/locations/{loc}/reviews/{revId}

            // We need to fetch the full review details because webhook payload is lean
            // But we need auth. Who is the user?
            // Webhooks are machine-to-machine. We typically use a Service Account or have a valid token stored.
            // For this architecture (NextAuth + User Tokens), handling webhooks is tricky without a global system token.
            // HOWEVER: We can find the Location in our DB by parsing the `name` (it contains locationId).

            // Extract locationId from "accounts/{acc}/locations/{loc}/reviews/{rev}"
            const parts = name.split("/");
            const locationId = `accounts/${parts[1]}/locations/${parts[3]}`; // Reconstruct "accounts/x/locations/y"

            // Find the location in our DB to get organization -> users -> valid tokens
            const location = await prisma.location.findUnique({
                where: { googleLocationId: locationId },
                include: { organization: { include: { users: true } } }
            });

            if (location && location.organization?.users?.length > 0) {
                // Use the first user's token (assuming they are admin/linked)
                // This is a simplification. In prod, use a stored refresh token at Org level.
                const adminUser = location.organization.users[0];

                const googleService = new GoogleBusinessService();
                await googleService.init(adminUser.id);

                // Fetch the specific review
                // name is already the review resource name
                // But our updated getReviews only lists.
                // We need `getReview(name)`. 
                // Let's implement specific fetch or just re-list if easier.
                // Assuming we can list and find or add a `getReview`.

                // Let's just Trigger Sync for that location! Easier and robust.
                await googleService.getReviews(locationId);
                // Wait, that just returns them. We need to save.
                // Let's just call our sync logic?
                // But sync logic is in actions (server) requires session.

                // Let's inline the save logic here.
                const allReviews = await googleService.getReviews(locationId);
                const reviewsList = (allReviews as any).reviews || [];
                const reviewData = reviewsList.find((r: any) => r.name === name || r.reviewId === parts[5]);

                if (reviewData) {
                    // Logic to Save and AI Reply
                    const tone = location.organization.preferredTone || "Professional";

                    const starRatingMap: Record<string, number> = { "ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5 };
                    const stars = starRatingMap[reviewData.starRating] || 5;

                    let aiDraft = null;
                    let sentiment = "Neutral";
                    let language = "en";

                    if (reviewData.comment) {
                        const aiRes = await generateReviewReply(reviewData.comment, reviewData.reviewer.displayName, stars, tone);
                        if (aiRes) {
                            aiDraft = aiRes.reply;
                            sentiment = aiRes.sentiment;
                        }
                    }

                    await prisma.review.upsert({
                        where: { googleReviewId: reviewData.reviewId },
                        update: {},
                        create: {
                            googleReviewId: reviewData.reviewId,
                            reviewerName: reviewData.reviewer.displayName,
                            starRating: stars,
                            comment: reviewData.comment || "",
                            reviewDate: new Date(reviewData.createTime),
                            locationId: location.id,
                            status: aiDraft ? "DRAFT_CREATED" : "PENDING",
                            aiDraftReply: aiDraft,
                            sentiment,
                            language
                        }
                    });
                    console.log("✅ Webhook: Processed new review for", location.name);
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (e) {
        console.error("Webhook Error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
