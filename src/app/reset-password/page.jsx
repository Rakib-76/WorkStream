"use client";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ResetPassword() {
    const params = useSearchParams();
    const email = params.get("email");
    const token = params.get("token");

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        const toastId = toast.loading("Resetting...");
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token, password: data.password }),
            });

            const result = await res.json();
            if (res.ok) {
                toast.success("Password reset successful ✅", { id: toastId });
                window.location.href = "/login";
            } else {
                toast.error(result.message || "Failed ❌", { id: toastId });
            }
        } catch (err) {
            toast.error("Error ⚠️", { id: toastId });
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Password Field with Show/Hide */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 5, message: "At least 5 characters" },
                            })}
                            className="w-full text-gray-600 px-3 py-2 border rounded pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
