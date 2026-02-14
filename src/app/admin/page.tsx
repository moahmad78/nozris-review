
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Shield, Building2, Users, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
    const session = await auth();

    // Verify Super Admin
    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id },
        select: { role: true }
    });

    if (user?.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    // Fetch Global Stats
    const orgs = await prisma.organization.findMany({
        include: {
            _count: {
                select: { locations: true, users: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const totalReviews = await prisma.review.count();
    const totalLocations = await prisma.location.count();
    const totalUsers = await prisma.user.count();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Shield className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Super Admin Console</h1>
                </div>
                <div className="text-sm text-gray-500">
                    Logged in as Super Admin
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Organizations</p>
                                <h3 className="text-2xl font-bold text-gray-900">{orgs.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Reviews Processed</p>
                                <h3 className="text-2xl font-bold text-gray-900">{totalReviews}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organizations Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Organizations</h2>
                    </div>
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-medium text-xs">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Tone</th>
                                <th className="px-6 py-3">Locations</th>
                                <th className="px-6 py-3">Users</th>
                                <th className="px-6 py-3">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orgs.map((org) => (
                                <tr key={org.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{org.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                            {org.preferredTone}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{org._count.locations}</td>
                                    <td className="px-6 py-4">{org._count.users}</td>
                                    <td className="px-6 py-4">{new Date(org.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
