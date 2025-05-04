import { Metadata } from "next";
import LoginForm from "./components/LoginForm";

export const metadata: Metadata = {
    title: "Login | Bitex",
    description: "Login to your Bitex account",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <a
                            href="/auth/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            create a new account
                        </a>
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
} 