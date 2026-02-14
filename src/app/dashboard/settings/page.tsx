import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Settings, Save, Globe, Bot } from "lucide-react";
import { updateOrganizationSettings } from "@/actions/settings-actions";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await auth();

    // Fetch current organization
    let org = null;
    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { organization: true }
        });
        org = user?.organization;
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                    <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </header>

            {/* Google Connection Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-gray-800">Google Connection</h2>
                        <p className="text-xs text-gray-500">Link your Google Business Profile to sync reviews.</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                        <Globe className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-6">
                    <form action={async () => {
                        "use server";
                        // NextAuth SignIn with Google and proper scopes
                        // We can't call signIn directly in server action easily without redirect
                        // Better to use a Link or Client Component BUT for simplicity in this demo:
                        redirect("/api/auth/signin/google");
                    }}>
                        <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm">
                            <Globe className="w-5 h-5" /> Connect Google Business Profile
                        </button>
                    </form>
                    <p className="text-xs text-center text-gray-400 mt-3">
                        Required for Review Sync & Auto-Reply
                    </p>
                </div>
            </div>

            {/* General Preferences Form */}
            <form action={async (formData) => {
                "use server";
                await updateOrganizationSettings(formData);
            }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mt-6">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Automation & Preferences</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                        <input
                            type="text"
                            disabled
                            value={org?.name || "No Organization"}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-indigo-900">AI Auto-Reply</h3>
                                <p className="text-xs text-indigo-700">Automatically draft replies for new reviews.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="autoReplyEnabled"
                                className="sr-only peer"
                                defaultChecked={org?.autoReplyEnabled || false}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred AI Tone</label>
                        <select
                            name="preferredTone"
                            defaultValue={org?.preferredTone || "Professional"}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="Professional">Professional</option>
                            <option value="Friendly">Friendly</option>
                            <option value="Witty">Witty</option>
                            <option value="Apologetic">Apologetic</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Controls the tone of AI-generated replies.</p>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}


