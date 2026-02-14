
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ReviewsClient from "@/components/ReviewsClient";

export default async function ReviewsPage() {
    const session = await auth();
    if (!session?.user?.organizationId) return <div>Access Denied</div>;

    const reviews = await prisma.review.findMany({
        where: {
            location: {
                organizationId: session.user.organizationId
            }
        },
        include: { location: true },
        orderBy: { reviewDate: "desc" }
    });

    // Convert dates to string/number if needed for passing to client components to avoid serialization warning, 
    // but Date objects usually pass fine in App Router server->client.
    // Actually, sometimes they warn. Let's pass as is and check.

    return <ReviewsClient initialReviews={reviews as any} />;
}
