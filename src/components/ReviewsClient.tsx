"use client";

import { useState } from "react";
import { Star, Search, Filter } from "lucide-react";
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

export default function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [ratingFilter, setRatingFilter] = useState("ALL");
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.reviewerName.toLowerCase().includes(search.toLowerCase()) ||
            (review.comment || "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || review.status === statusFilter;
        const matchesRating = ratingFilter === "ALL" || review.starRating.toString() === ratingFilter;

        return matchesSearch && matchesStatus && matchesRating;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                <div className="flex items-center gap-3">
                    <SyncReviewsButton />
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="DRAFT_CREATED">Drafted</option>
                        <option value="POSTED">Posted</option>
                    </select>

                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="ALL">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-medium text-xs">
                            <tr>
                                <th className="px-6 py-4">Reviewer</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Comment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No reviews found matching filters.
                                    </td>
                                </tr>
                            ) : filteredReviews.map((review) => (
                                <tr
                                    key={review.id}
                                    onClick={() => setSelectedReview(review)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {review.reviewerName}
                                        <div className="text-xs text-gray-400 font-normal">{review.location.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {Array.from({ length: review.starRating }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={review.comment || ""}>
                                        {review.comment || <span className="italic text-gray-300">No comment</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={review.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(review.reviewDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedReview && (
                <ReviewDetailModal
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                />
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-gray-100 text-gray-600",
        DRAFT_CREATED: "bg-blue-50 text-blue-600",
        APPROVED: "bg-green-50 text-green-600",
        POSTED: "bg-purple-50 text-purple-600",
        IGNORED: "bg-red-50 text-red-600"
    };

    const style = styles[status] || styles.PENDING;
    const label = status.replace('_', ' ');

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
            {label}
        </span>
    );
}
