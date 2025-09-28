"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

async function registerUser({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // ✅ fix typo here
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
}

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    // ✅ Debounce email input (e.g. for live validation)
    const debouncedEmail = useDebounce(email, 500);

    // ✅ Mutation Hook
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log("Success:", data);
            router.push("/login");
        },
        onError: (error: any) => {
            console.error("Error:", error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        mutation.mutate({ email: debouncedEmail, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <a href="/Login" className="text-indigo-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
