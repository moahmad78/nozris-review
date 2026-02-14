"use client";

import { useState, useMemo } from "react";
import { Star, AlertCircle, Search, Filter } from "lucide-react";
import { SyncReviewsButton } from "@/components/SyncReviewsButton";
import { ReviewDetailModal } from "@/components/ReviewDetail";

type Review = {
    id: string;
    reviewerName: string;
    starRating: number;
    comment: string | null;
    reviewDate: Date;
    aiDraftReply: string | null;
    status: string;
    googleReviewId: string;
    location: { name: string };
};

export default function ReviewsPage({ reviews }: { reviews: Review[] }) {
    // In a real app, filtering should be server-side with searchParams. 
    // For MVP/Demo, client-side filtering is acceptable if dataset is small (<1000).
    // Implementation note: I should fetch data in a parent server component and pass it here, 
    // OR make this a server component with searchParams and move interactive parts to client.
    // Given the complexity of modal state, let's make the Page Client for now, 
    // but we need to fetch data. Wait, "use client" cannot be async page.
    // So I will make a separate client component "ReviewsTable" and keep page.tsx server-side.
    return null; // Logic moved to ReviewsClient.tsx to separate concerns properly.
}
