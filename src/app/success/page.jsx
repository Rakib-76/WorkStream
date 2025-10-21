"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Success() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email"); // Stripe session এ পাঠানো email
    const plan = searchParams.get("plan");   // Stripe session এ পাঠানো plan name

    useEffect(() => {
        if (email && plan) {
            fetch("/api/update-membership", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newMembership: plan }), // plan name বা custom value
            })
                .then(res => res.json())
                .then(data => console.log("Membership updated:", data))
                .catch(err => console.error("Update membership error:", err));
        }
    }, [email, plan]);

    return (
        <div className="text-center mt-20 max-h-screen">
            <h1 className="text-4xl font-bold text-green-500">Payment Successful!</h1>
            <p className="mt-4">Thank you for your purchase. Your membership has been updated.</p>

            <div className="mt-8 flex justify-center gap-4">
                <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Go to Dashboard
                </a>
                <a href="/" className="bg-green-600 text-white px-4 py-2 rounded">
                    Home
                </a>
            </div>
        </div>
    );
}
