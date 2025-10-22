"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const [email , setEmail] = searchParams.get("email");
    const [plan , setPlan ] = searchParams.get("plan");
    const [message, setMessage] = useState("Updating membership...");


    useEffect(() => {
        const e = searchParams.get("email");
        const p = searchParams.get("plan");
        setEmail(e);
        setPlan(p);
    },[searchParams]);

    useEffect(() => {
        if (!email || !plan) return;
            const updateMembership = async () => {
                try {
                    const newMembership = plan.toLowerCase(); // e.g. 'premium'
                    const res = await fetch("/api/update-membership", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, newMembership }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                        setMessage(`✅ Payment successful! Membership upgraded to ${newMembership}.`);
                    } else {
                        setMessage(`❌ Failed to update membership: ${data.error}`);
                    }
                } catch (error) {
                    setMessage("❌ Something went wrong while updating membership.");
                }
            };

            updateMembership();
    }, [email, plan]);

    return (
        <div className="flex items-center justify-center h-screen bg-green-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Success 🎉</h1>
                <p className="text-gray-700">{message}</p>
                <div className="mt-8 flex justify-center gap-4">
                    <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Go to Dashboard
                    </a>
                    <span className="text-black">or</span>
                    <a href="/" className="bg-green-600 text-white px-4 py-2 rounded">
                        Home
                    </a>
                </div>
            </div>
        </div>
    );
}
