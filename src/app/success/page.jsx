"use client";
export const dynamic = "force-dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
    const [email, setEmail] = useState(null);
    const [plan, setPlan] = useState(null);
    const [message, setMessage] = useState("Updating membership...");
    // 1. New state to track if the component has mounted
    const [isClient, setIsClient] = useState(false);

    // Only call useSearchParams if it's the client.
    // If not mounted, searchParams will be null (or you can conditionally call the hook if that's preferred, but this is a common pattern).
    const searchParams = useSearchParams(); 

    // 2. Set isClient to true on initial client-side mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // 3. Conditionally run the logic that depends on searchParams
    useEffect(() => {
        // Only run this block if it's the client and we have searchParams
        if (!isClient) return; 

        const e = searchParams.get("email");
        const p = searchParams.get("plan");
        setEmail(e);
        setPlan(p);
    }, [searchParams, isClient]); // Added isClient to dependency array

    // The rest of your useEffect for updating membership remains mostly the same,
    // but we check isClient at the start for safety, though the dependencies
    // (email, plan) already prevent it from running until searchParams are processed.
    useEffect(() => {
        if (!isClient || !email || !plan) return; // Added isClient check
        
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
    }, [email, plan, isClient]); // Added isClient to dependency array

    // ... (rest of the component's return block)
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