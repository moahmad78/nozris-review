"use client";

import { useState } from "react";
import { syncLocations } from "@/actions/google-actions";
import { RefreshCw } from "lucide-react";

export function SyncButton() {
    const [loading, setLoading] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await syncLocations();
            if (!res.success) {
                alert("Error: Sync failed");
            } else {
                alert(`Synced ${res.count} locations!`);
            }
        } catch (e) {
            alert("Failed to sync");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Sync Locations"}
        </button>
    );
}
