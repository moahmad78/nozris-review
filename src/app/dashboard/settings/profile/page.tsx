import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { updateProfile } from "@/actions/profile-actions";
import { User, Mail, Phone, MapPin, Save, Camera } from "lucide-react";

export default async function ProfileSettingsPage() {
    const session = await auth();
    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id },
    });

    if (!user) return <div>User not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-500">Manage your account information and preferences.</p>
            </header>

            <form action={async (formData) => {
                "use server";
                await updateProfile(formData);
            }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Personal Information</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Profile Picture Placeholder */}
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 relative">
                            {user.image ? (
                                <img src={user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-8 h-8" />
                            )}
                            <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-sm">
                                <Camera className="w-3 h-3" />
                            </button>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Profile Picture</h3>
                            <p className="text-xs text-gray-500">PNG, JPG up to 2MB (Feature coming soon)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={user.name || ""}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={user.email || ""}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                                    readOnly
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    name="phone"
                                    type="tel"
                                    defaultValue={user.phone || ""}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    name="address"
                                    type="text"
                                    defaultValue={user.address || ""}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="123 Business St, City"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
