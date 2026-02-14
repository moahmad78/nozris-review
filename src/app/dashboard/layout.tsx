import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Smart Redirection: If user has no organization, send them to Onboarding
    if (!session?.user?.organizationId) {
        redirect("/onboarding");
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
