import Link from "next/link";
import { LayoutDashboard, Star, MapPin, Settings, Building2, ChevronDown } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Reviews", href: "/dashboard/reviews", icon: Star },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export async function Sidebar() {
  const session = await auth();
  let orgName = "Select Org";
  let allOrgs: any[] = [];
  let isSuperAdmin = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true }
    });
    orgName = user?.organization?.name || "No Organization";
    isSuperAdmin = user?.role === "SUPER_ADMIN";

    if (isSuperAdmin) {
      allOrgs = await prisma.organization.findMany({ select: { id: true, name: true } });
    }
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Nozris</h1>

        {/* Organization Switcher */}
        <div className="relative group">
          <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="truncate max-w-[120px]">{orgName}</span>
            </div>
            {isSuperAdmin && <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {isSuperAdmin && allOrgs.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden group-hover:block">
              <div className="py-1 max-h-48 overflow-y-auto">
                {allOrgs.map((org) => (
                  <form key={org.id} action={async () => {
                    "use server";
                    await prisma.user.update({
                      where: { id: session?.user?.id },
                      data: { organizationId: org.id }
                    });
                    redirect("/dashboard");
                  }}>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <span className="truncate">{org.name}</span>
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
