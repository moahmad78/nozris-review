"use strict";
"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Settings, LogOut, Shield } from "lucide-react";
import { signOut } from "next-auth/react"; // Assuming next-auth/react is available/client side capable

// If next-auth/react isn't set up for client, we can use a server action wrapper or simple link to api/auth/signout
// But usually signOut from next-auth/react works if SessionProvider is present, or we can just redirect.
// Let's use a server action triggered via form or just a link for now to be safe if provider missing.
// Actually, standard NextAuth v5 uses server actions mostly.
// Let's implement a simple logout function here or link.

export function UserProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-4 border-l border-gray-200 outline-none hover:opacity-80 transition-opacity"
            >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden">
                    <User className="w-5 h-5" />
                    {/* If user has image, we could show it: <img src={user.image} /> */}
                </div>
                <div className="hidden md:block text-left">
                    <span className="block text-sm font-medium text-gray-700">Client Admin</span>
                    <span className="block text-xs text-gray-400">Manage Account</span>
                </div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden py-1">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-sm font-medium text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@nozris.com</p>
                        </div>

                        <Link href="/dashboard/settings/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <User className="w-4 h-4 text-gray-400" /> Profile Settings
                        </Link>
                        <Link href="/dashboard/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Settings className="w-4 h-4 text-gray-400" /> Global Settings
                        </Link>
                        <Link href="/dashboard/security" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Shield className="w-4 h-4 text-gray-400" /> Security
                        </Link>

                        <div className="border-t border-gray-100 mt-1 pt-1">
                            <form action={async () => {
                                // Dynamic import or server action could go here
                                // For now, simple link to signout endpoint
                                window.location.href = "/api/auth/signout";
                            }}>
                                <button type="submit" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
