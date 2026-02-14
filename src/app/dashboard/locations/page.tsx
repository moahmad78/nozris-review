
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SyncButton } from "@/components/SyncButton";
import { MapPin } from "lucide-react";

export default async function LocationsPage() {
    const session = await auth();
    if (!session?.user?.organizationId) return <div>Access Denied</div>;

    const locations = await prisma.location.findMany({
        where: { organizationId: session.user.organizationId },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
                <SyncButton />
            </div>

            {locations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No locations found</h3>
                    <p className="text-gray-500">Sync with Google to import your business locations.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((loc: any) => (
                        <div key={loc.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-gray-900 truncate">{loc.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 truncate">{loc.address || "No address provided"}</p>
                            <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-4">
                                <span>ID: {loc.googleLocationId.split('/').pop()}</span>
                                <span>Synced just now</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
