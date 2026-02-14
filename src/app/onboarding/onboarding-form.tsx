"use client";

import { createOrganization } from "@/actions/onboarding";
import { useState } from "react";
import { Building2, Globe, ArrowRight, Loader2 } from "lucide-react";

export default function OnboardingForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError("");

        const res = await createOrganization(formData);
        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Setup your Business
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create an organization to start managing your reviews.
                    </p>
                </div>

                <form action={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                            <div className="mt-1 flex items-center rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                                <input
                                    name="orgName"
                                    type="text"
                                    placeholder="e.g. Toyota Showroom Delhi"
                                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Website URL</label>
                            <div className="mt-1 flex items-center rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                                <input
                                    name="website"
                                    type="url"
                                    placeholder="https://www.toyota.com"
                                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Continue to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
