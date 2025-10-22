"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cancel() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const plan = searchParams.get("plan");
  const [message, setMessage] = useState("Payment was canceled.");

  useEffect(() => {
    if (email && plan) {
      console.log(`Payment canceled for ${email} on plan ${plan}`);
    }
  }, [email, plan]);

  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Canceled ❌</h1>
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
