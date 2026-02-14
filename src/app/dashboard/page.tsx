import Link from "next/link";
import { MoveUpRight, Star, MessageSquare, AlertCircle, Info } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { RatingTrendChart, SentimentPieChart } from "@/components/AnalyticsCharts";
import { SyncButton } from "@/components/SyncButton";
import { SyncReviewsButton } from "@/components/SyncReviewsButton";

export default async function DashboardPage() {
    const session = await auth();

    let reviews: any[] = [];
    let isDemo = false;

    if (session?.user?.organizationId) {
        reviews = (await prisma.review.findMany({
            where: {
                location: { organizationId: session.user.organizationId }
            },
            orderBy: { reviewDate: "asc" }
        })) as any[];
    }

    // fallback to demo data if no reviews found or no org
    if (reviews.length === 0) {
        isDemo = true;
        reviews = [
            { id: "demo-1", reviewerName: "Alice Smith", starRating: 5, comment: "Amazing service!", reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), sentiment: "Positive", status: "POSTED" },
            { id: "demo-2", reviewerName: "John Doe", starRating: 4, comment: "Good, but could be faster.", reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), sentiment: "Neutral", status: "DRAFT_CREATED" },
            { id: "demo-3", reviewerName: "Emma Wilson", starRating: 5, comment: "Loved it!", reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), sentiment: "Positive", status: "POSTED" },
            { id: "demo-4", reviewerName: "Michael Brown", starRating: 2, comment: "Not what I expected.", reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), sentiment: "Negative", status: "PENDING" },
            { id: "demo-5", reviewerName: "Sarah Davis", starRating: 5, comment: "Highly recommend.", reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), sentiment: "Positive", status: "POSTED" },
            { id: "demo-6", reviewerName: "David Lee", starRating: 3, comment: "Average experience.", reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), sentiment: "Neutral", status: "PENDING" },
            { id: "demo-7", reviewerName: "Emily Clark", starRating: 5, comment: "Fantastic!", reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), sentiment: "Positive", status: "POSTED" },
        ];
    }

    // KPI Calculations
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.starRating, 0) / totalReviews).toFixed(1)
        : "0.0";
    const pendingActions = reviews.filter(r => r.status === "PENDING" || r.status === "DRAFT_CREATED").length;

    const stats = [
        { name: "Total Reviews", value: totalReviews.toString(), change: isDemo ? "Demo Data" : "+12% vs last month", icon: MessageSquare, color: "bg-blue-500" },
        { name: "Average Rating", value: avgRating, change: isDemo ? "Demo Data" : "+0.2 vs last month", icon: Star, color: "bg-yellow-500" },
        { name: "Pending Actions", value: pendingActions.toString(), change: pendingActions > 0 ? "Action Needed" : "All Clear", icon: AlertCircle, color: "bg-red-500" },
    ];

    // Chart Data Preparation
    // 1. Rating Trend
    const ratingsByDate = reviews.reduce((acc, review) => {
        const date = new Date(review.reviewDate).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = { sum: 0, count: 0 };
        acc[date].sum += review.starRating;
        acc[date].count += 1;
        return acc;
    }, {} as Record<string, { sum: number, count: number }>);

    const trendData = Object.entries(ratingsByDate).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        rating: parseFloat(((data as any).sum / (data as any).count).toFixed(1))
    })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-10);

    // 2. Sentiment Distribution
    const sentimentCounts = {
        Positive: reviews.filter(r => r.sentiment === "Positive").length,
        Neutral: reviews.filter(r => r.sentiment === "Neutral").length,
        Negative: reviews.filter(r => r.sentiment === "Negative").length
    };

    const sentimentData = [
        { name: "Positive", value: sentimentCounts.Positive, color: "#10B981" }, // Emerald 500
        { name: "Neutral", value: sentimentCounts.Neutral, color: "#F59E0B" },  // Amber 500
        { name: "Negative", value: sentimentCounts.Negative, color: "#EF4444" }  // Red 500
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Overview of your reputation</p>
                </div>
                <div className="flex items-center gap-3">
                    <SyncButton />
                    <SyncReviewsButton />
                </div>
            </div>

            {isDemo && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900">Demo Mode Active</h4>
                        <p className="text-sm text-blue-700">
                            You are viewing sample data because no reviews have been synced yet.
                            Connect your Google Business Profile and click "Sync Locations" then "Sync Reviews" to get started.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-${stat.color.replace('bg-', '')}`}>
                                <stat.icon className={`w-6 h-6 ${stat.name === 'Total Reviews' ? 'text-blue-600' : stat.name === 'Average Rating' ? 'text-yellow-600' : 'text-red-600'}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={`${stat.name === 'Pending Actions' && parseInt(stat.value) > 0 ? 'text-red-500' : 'text-green-600'} font-medium flex items-center gap-1`}>
                                {stat.change} <MoveUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Average Rating Trend</h3>
                    <div className="h-64">
                        <RatingTrendChart data={trendData} />
                    </div>
                </div>

                {/* Sentiment Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Sentiment</h3>
                    <div className="h-64">
                        <SentimentPieChart data={sentimentData} />
                    </div>
                </div>
            </div>

            {/* Recent Activity / Reviews Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Recent Reviews</h3>
                    <Link href="/dashboard/reviews" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        View All
                    </Link>
                </div>

                <div className="divide-y divide-gray-100">
                    {reviews.slice(0, 5).reverse().map(review => (
                        <div key={review.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {review.reviewerName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900">{review.reviewerName}</h4>
                                    <div className="flex text-yellow-500 text-xs mt-0.5">
                                        {Array.from({ length: review.starRating }).map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current" />
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-md">
                                        {review.comment}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">
                                    {new Date(review.reviewDate).toLocaleDateString()}
                                </div>
                                {isDemo && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded ml-2">Demo</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
