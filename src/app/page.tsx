import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-indigo-600">Nozris</h1>
        <Link
          href="/dashboard" // Middleware will redirect to login if not authenticated
          className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Login
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Manage Google Reviews with <span className="text-indigo-600">AI Precision</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automate your reputation management. Draft perfect replies in seconds, handle multi-location businesses, and never miss a review again.
          </p>
          <div className="pt-8 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              View Demo
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {[
            "Multi-Location Support",
            "AI Auto-Drafting",
            "Real-time Notifications"
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <span className="font-medium text-gray-800">{feature}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-6 text-center text-gray-400 text-sm">
        © 2024 Nozris Inc. All rights reserved.
      </footer>
    </div>
  );
}
