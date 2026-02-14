import { NotificationHub } from "./NotificationHub";
import { UserProfileDropdown } from "./UserProfileDropdown";

export function Topbar() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4">
                {/* Breadcrumbs or Page Title could go here */}
                <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
                <NotificationHub />
                <UserProfileDropdown />
            </div>
        </header>
    );
}
