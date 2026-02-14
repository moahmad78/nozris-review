
import { signIn } from "@/auth";
import { MoveRight } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to access your dashboard</p>
                </div>

                <form
                    action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/dashboard" });
                    }}
                >
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium group"
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        <span>Continue with Google</span>
                        <MoveRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </form>

                <p className="text-xs text-gray-400 mt-8">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
