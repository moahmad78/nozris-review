"use client";

import { useState } from "react";
import { syncReviews } from "@/actions/google-actions";
import { RefreshCw, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function SyncReviewsButton() {
    const [loading, setLoading] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await syncReviews();
            if (!res.success) {
                toast.error("AI Automation mein thodi pareshani aayi.");
            } else {
                if (res.count > 0 && res.lastReviewer) {
                    toast.success(`AI ne ${res.lastReviewer} ke review ka perfect reply bhej diya hai!`, {
                        description: "Language matched aur grammar verify kar li gayi hai.",
                        action: {
                            label: "View Log",
                            onClick: () => window.location.href = "/dashboard/ai-logs",
                        },
                    });
                } else {
                    toast.info(`Synced ${res.count} reviews. No new reviews to reply to.`);
                }
            }
        } catch (e) {
            toast.error("AI Automation mein thodi pareshani aayi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Sync Reviews"}
        </button>
    );
}
