"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";


export function Pricing() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [loadingPlan, setLoadingPlan] = useState("");
  const plans = [
    {
      name: "Basic",
      price: "$0",
      amount: 0,
      subtitle: "Perfect for individuals or small teams getting started.",
      features: ["Up to 3 Projects", "Basic Task Management", "5GB File Storage", "Community Support"],
      buttonText: "Get Started",
      highlight: false,
      isFree: true,
    },
    {
      name: "Premium",
      price: "$99",
      amount: 99,
      subtitle: "For teams that need full control and collaboration tools.",
      features: ["Unlimited Projects", "Advanced Task Automation", "200GB File Storage", "24/7 Priority Support", "Slack, GitHub, Google Drive Integration"],
      buttonText: "Upgrade Now",
      highlight: true,
      isFree: false,
    },
  ];

  const handleCheckout = async (plan) => {
    if (plan.isFree) {
      toast.success("🎉 Already selected this free plan!"); // <-- toast here
      return;
    }
    setLoadingPlan(plan.name);



    setLoadingPlan(plan.name);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userEmail }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingPlan("");
    }

  };

  return (
    <section id="pricing" className="py-20 bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Pricing & Plans</h2>
        <p className="text-gray-400 text-lg mb-12">
          Choose the plan that fits your workflow and scale your productivity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col justify-between h-full rounded-2xl p-8 border transition-all duration-300 ${plan.highlight ? "bg-gradient-to-b from-blue-600 to-indigo-700 border-none" : "bg-[#111827] border border-gray-700"
                }`}
            >
              {plan.highlight && (
                <span className="absolute top-0 right-0 mt-2 mr-6 bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full">
                  Popular
                </span>
              )}

              <div>
                <h3 className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-gray-100"}`}>{plan.name}</h3>
                <p className={`mt-2 text-base ${plan.highlight ? "text-gray-200" : "text-gray-400"}`}>{plan.subtitle}</p>
                <h4 className="text-6xl font-extrabold mt-6 mb-8">{plan.price}</h4>
              </div>

              <ul className="space-y-3 mb-8 text-left mx-auto w-full max-w-xs flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.highlight ? "text-green-300" : "text-blue-500"}`} />
                    <span className={`${plan.highlight ? "text-gray-100" : "text-gray-300"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full py-3 rounded-lg text-lg font-semibold transition-all ${plan.highlight ? "bg-white text-blue-700 hover:bg-gray-100" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {loadingPlan === plan.name ? "Processing..." : plan.buttonText}
              </button>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
