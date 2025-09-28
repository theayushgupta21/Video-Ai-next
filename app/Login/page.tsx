"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter(); // ✅ fixed typo + correct import

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            console.log(result.error);
        } else {
            router.push("/"); // ✅ correctly using router
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
                    ><a href="/Home" className="text-indigo-600 hover:underline">
                            Login
                        </a></button>
                </form>
                <p className="text-sm text-gray-600 text-center mt-4">
                    Don’t have an account?{" "}
                    <a
                        href="#"
                        className="text-purple-600 font-medium hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
