"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const verifyUserEmail = async () => {
        try {
            setLoading(true);
            const res = await axios.post("/api/v1/users/verifyemail", { token });
            console.log(res)
            setVerified(true);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token) verifyUserEmail();
    }, [token]);

    const getStatusIcon = () => {
        if (loading)
            return (
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            );
        if (verified)
            return <CheckCircle className="h-10 w-10 text-green-500" />;
        if (error)
            return <XCircle className="h-10 w-10 text-red-500" />;
        return null;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl px-6 py-8 text-center"
            >
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                        {getStatusIcon()}
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2 text-neutral-700 dark:text-neutral-200">
                    Email Verification
                </h1>

                {loading && (
                    <p className="text-blue-600 dark:text-blue-400">Verifying your email...</p>
                )}

                {verified && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2"
                    >
                        <p className="text-green-600 dark:text-green-400 font-medium">
                            Your email has been verified!
                        </p>
                        <Link
                            href="/login"
                            className="mt-4 inline-block text-blue-600 dark:text-blue-400 font-medium underline"
                        >
                            Go to Login
                        </Link>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2"
                    >
                        <p className="text-red-600 dark:text-red-400 font-medium">
                            Verification failed. Token may be invalid or expired.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
