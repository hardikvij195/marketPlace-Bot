"use client";

import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";

const plans = [
  {
    title: "Trial Run - 2 Days",
    price: "$0.00",
    features: [
      { text: "Simple Reply To ask for Phone Number", available: true },
      { text: "Google Sheet Integration", available: true },
      { text: "CRM Integration", available: false },
      { text: "Advanced Prompt with AI", available: false },
      { text: "Custom Prompt with AI", available: false },
      { text: "Unlimited Leads Automation", available: false },
      { text: "AI Calling Setup (Extra 1000 USD)", available: false },
      { text: "Lead Nurturing Automations (Extra 1,000 USD)", available: false },
    ],
    buttonText: "Start Trial",
    type: "trial",
  },
  {
    title: "Foundation Pack - 1 Week",
    price: "$30.00",
    features: [
      { text: "Simple Reply To ask for Phone Number", available: true },
      { text: "Google Sheet Integration", available: true },
      { text: "CRM Integration", available: false },
      { text: "Advanced Prompt with AI", available: false },
      { text: "Custom Prompt with AI", available: false },
      { text: "Unlimited Leads Automation", available: false },
      { text: "AI Calling Setup (Extra 1000 USD)", available: false },
      { text: "Lead Nurturing Automations (Extra 1,000 USD)", available: false },
    ],
    buttonText: "Buy Now",
    type: "foundation",
  },
  {
    title: "Growth Engine - 1 Month",
    price: "$100.00",
    features: [
      { text: "Simple Reply To ask for Phone Number", available: true },
      { text: "Google Sheet Integration", available: true },
      { text: "CRM Integration", available: true },
      { text: "Advanced Prompt with AI", available: false },
      { text: "Custom Prompt with AI", available: false },
      { text: "Unlimited Leads Automation", available: false },
      { text: "AI Calling Setup (Extra 1000 USD)", available: false },
      { text: "Lead Nurturing Automations (Extra 1,000 USD)", available: false },
    ],
    buttonText: "Buy Now",
    type: "growth",
  },
  {
    title: "Ultimate Advantage - 1 Month",
    price: "$300.00",
    features: [
      { text: "Simple Reply To ask for Phone Number", available: true },
      { text: "Google Sheet Integration", available: true },
      { text: "CRM Integration", available: true },
      { text: "Advanced Prompt with AI", available: true },
      { text: "Custom Prompt with AI", available: true },
      { text: "Unlimited Leads Automation", available: true },
      { text: "AI Calling Setup (Extra 1000 USD)", available: true },
      { text: "Lead Nurturing Automations (Extra 1,000 USD)", available: true },
    ],
    buttonText: "Buy Now",
    type: "ultimate",
  },
];

export default function Subscriptions() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabaseBrowser.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setLoading(false);
        return;
      }

      if (data.user) setUser(data.user);

      setLoading(false);
    };

    checkUser();
  }, []);

  const handleClick = async (plan) => {
    if (plan.type === "contact") {
      router.push(plan.link);
      return;
    }

    if (user) {
      router.push(`/dashboard/subscription-buy?plan=${plan.type}`);
    } else {
      router.push("/sign-in");
    }
  };

  if (loading) return null; // or a spinner

  return (
    <section className="py-10 px-4 md:px-12 lg:px-24 text-white">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-black">Subscriptions</h2>
        <p className="text-lg text-black mt-3">
          So What Does It Cost? – Be A Part Of Us!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl p-8 shadow-md ${
              plan.special ? "border-2 border-blue-500" : ""
            }`}
          >
            <div className="pt-6 pb-4 text-center">
              <h3 className="text-md font-semibold text-[#2563EB]">{plan.title}</h3>
              <p className="text-4xl font-bold mt-2 text-[#2563EB]">{plan.price}</p>
            </div>

            <ul className="mt-6 space-y-3 text-black">
              {plan.features.map((feature, fidx) => (
                <li key={fidx} className="flex items-center gap-3 text-sm">
                  {feature.available ? (
                    <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  ) : (
                    <X className="text-rose-800 w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                onClick={() => handleClick(plan)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-blue-500 text-white font-semibold text-sm hover:opacity-90 transition"
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
