"use client";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const toastId = toast.loading("Processing...");
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Check your email for reset link ✅", { id: toastId });
            } else {
                toast.error(result.message || "Something went wrong ❌", { id: toastId });
            }
        } catch (err) {
            toast.error("Server error ⚠️", { id: toastId });
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="p-3 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Forgot Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", { required: "Email is required" })}
                        className="w-full text-gray-600 px-3 py-2 border rounded"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 cursor-pointer bg-blue-600 text-white rounded"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
}
