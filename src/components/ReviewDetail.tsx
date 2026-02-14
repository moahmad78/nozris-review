"use client";

import { useState } from "react";
import { X, Star, Wand2, Send, Save } from "lucide-react";
import { updateReviewDraft, postReviewReply } from "@/actions/review-actions";

type Review = {
    id: string;
    reviewerName: string;
    starRating: number;
    comment: string | null;
    reviewDate: Date;
    aiDraftReply: string | null;
    status: string;
    googleReviewId: string;
};

export function ReviewDetailModal({ review, onClose }: { review: Review, onClose: () => void }) {
    const [draft, setDraft] = useState(review.aiDraftReply || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const handleSaveDraft = async () => {
        setIsSaving(true);
        const res = await updateReviewDraft(review.id, draft);
        setIsSaving(false);
        if (res.error) alert(res.error);
        else alert("Draft saved!");
    };

    const handlePost = async () => {
        if (!confirm("Are you sure you want to post this reply publically?")) return;
        setIsPosting(true);
        const res = await postReviewReply(review.id, draft);
        setIsPosting(false);
        if (res.error) alert(res.error);
        else {
            alert("Posted successfully!");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{review.reviewerName}</h2>
                        <div className="flex items-center gap-1 text-yellow-500 mt-1">
                            {Array.from({ length: review.starRating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 flex-1">
                    {/* Review Text */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Customer Review</label>
                        <p className="text-gray-800 leading-relaxed">
                            {review.comment || <span className="italic text-gray-400">No comment text</span>}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 text-right">
                            {new Date(review.reviewDate).toLocaleDateString()}
                        </p>
                    </div>

                    {/* AI Draft Editor */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide flex items-center gap-2">
                                <Wand2 className="w-3 h-3" />
                                AI Suggested Reply
                            </label>
                            <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                                Regenerate
                            </button>
                        </div>
                        <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-gray-700 leading-relaxed"
                            placeholder="Draft your reply here..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        onClick={handlePost}
                        disabled={isPosting || !draft}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        {isPosting ? "Posting..." : "Post Reply"}
                    </button>
                </div>
            </div>
        </div>
    );
}
