"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export function NotificationHub() {
    const [isOpen, setIsOpen] = useState(false);

    // Mock notifications for now - later fetch from DB
    const notifications = [
        { id: 1, title: "New Review", message: "Rahul Sharma left a 5-star review.", time: "2 min ago", unread: true },
        { id: 2, title: "AI Reply Sent", message: "Auto-reply sent to Sarah Davis.", time: "15 min ago", unread: true },
        { id: 3, title: "Quota Warning", message: "OpenAI balance is low.", time: "1 hour ago", unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button className="text-xs text-indigo-600 hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div key={notification.id} className={`p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 ${notification.unread ? 'bg-blue-50/50' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notification.time}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                        <button className="text-xs text-gray-600 hover:text-gray-900 font-medium">View all activity</button>
                    </div>
                </div>
            )}

            {/* Click outside closer overlay if needed, or simple toggle */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
}
