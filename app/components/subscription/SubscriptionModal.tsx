// app/subscription/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
import { Check, X } from "lucide-react";

type planState = {
  plan_name: string;
  id: string;
  type: string;
  amount: string;
  duration: string;
  basic_amount?: string;
};

// Static features mapped to plan names
const featuresMap = {
  "Trial Run": {
    features: [
      { text: "Simple Reply To ask for Phone Number", included: true },
      { text: "Google Sheet Integration", included: true },
      { text: "CRM Integration", included: false },
      { text: "Advanced Prompt with AI", included: false },
      { text: "Custom Prompt with AI", included: false },
      { text: "AI Calling Setup (Extra 1,000 USD)", included: false },
      { text: "Lead Nurturing Automations (Extra 1,000 USD)", included: false },
    ],
  },
  "Foundation Pack": {
    features: [
      { text: "Simple Reply To ask for Phone Number", included: true },
      { text: "Google Sheet Integration", included: true },
      { text: "CRM Integration", included: false },
      { text: "Advanced Prompt with AI", included: false },
      { text: "Custom Prompt with AI", included: false },
      { text: "AI Calling Setup (Extra 1,000 USD)", included: false },
      { text: "Lead Nurturing Automations (Extra 1,000 USD)", included: false },
    ],
  },
  "Growth Engine": {
    features: [
      { text: "Simple Reply To ask for Phone Number", included: true },
      { text: "Google Sheet Integration", included: true },
      { text: "CRM Integration", included: true },
      { text: "Advanced Prompt with AI", included: false },
      { text: "Custom Prompt with AI", included: false },
      { text: "AI Calling Setup (Extra 1,000 USD)", included: false },
      { text: "Lead Nurturing Automations (Extra 1,000 USD)", included: false },
    ],
  },
  "Ultimate Advantage": {
    features: [
      { text: "Simple Reply To ask for Phone Number", included: true },
      { text: "Google Sheet Integration", included: true },
      { text: "CRM Integration", included: true },
      { text: "Advanced Prompt with AI", included: true },
      { text: "Custom Prompt with AI", included: true },
      { text: "AI Calling Setup (Extra 1,000 USD)", included: true },
      { text: "Lead Nurturing Automations (Extra 1,000 USD)", included: true },
    ],
  },
};

export const SubscriptionDialog = ({
  setShowModal,
  setPaymentMethod,
  setSelectedSubscription,
}: {
  setShowModal: (val: boolean) => void;
  setPaymentMethod: (val: boolean) => void;
  setSelectedSubscription: (plan: planState) => void;
}) => {
  const [plans, setPlans] = useState<planState[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabaseBrowser
          .from("subscription")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;

        const formattedPlans: planState[] = (data as any[]).map((plan) => ({
          id: plan.id,
          plan_name: plan.plan_name,
          amount: plan.amount,
          type: plan.type,
          duration:
            plan.type === "2"
              ? "For 2 days"
              : plan.type === "week"
              ? "For 1 week"
              : "For 1 month",
        }));

        setPlans(formattedPlans);
      } catch (error: any) {
        console.error("[SubscriptionDialog] Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanSelect = (plan: planState) => {
    setActivePlanId(plan.id);
    setSelectedSubscription(plan);
    setShowModal(false);
    setPaymentMethod(true);
  };

  const getButtonText = (planName: string) => {
    switch (planName) {
      case "Trial Run":
        return "Start Trial";
      case "Foundation Pack":
      case "Growth Engine":
        return "Buy Now";
      case "Ultimate Advantage":
        return "Contact Us";
      default:
        return "Subscribe";
    }
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[90%] p-6 overflow-y-auto lg:max-h-[90vh] md:max-h-[90vh] max-h-[140vh] relative">
        {/* Close Button */}
        <button
          className="absolute lg:text-2xl md:text-3xl text-4xl top-2 right-2 pr-2 text-gray-500 hover:text-gray-800"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-gray-900">
          Thank you for creating your account.
          <br />
          Please subscribe to a subscription plan.
        </h2>

        <main className="p-4">
          {loading ? (
            // Skeleton Loader
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 shadow-sm animate-pulse bg-gray-100 h-64"
                >
                  <div className="h-6 w-1/2 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-300 rounded mt-6"></div>
                </div>
              ))}
            </section>
          ) : plans.length === 0 ? (
            <p className="text-center text-gray-600">
              No subscription plans available.
            </p>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  aria-label={`${plan.plan_name} plan $${plan.amount} ${plan.duration}`}
                  className={`border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                    activePlanId === plan.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-900 border-gray-200"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="inline-block text-xs font-semibold rounded-full px-3 py-1 select-none text-blue-600 border border-blue-600">
                        {plan.plan_name}
                      </span>
                      <span className="text-sm font-normal text-right select-none">
                        {plan.duration}
                      </span>
                    </div>

                    <div className="flex justify-end items-baseline gap-1 mt-2">
                      <span className="text-xl font-extrabold select-none">
                        ${plan.amount}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      {featuresMap[
                        plan.plan_name as keyof typeof featuresMap
                      ]?.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <X className="w-4 h-4 text-rose-800" />
                          )}
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlanSelect(plan)}
                    className="cursor-pointer mt-6 w-full font-semibold text-sm border rounded-md py-2 transition-colors duration-200 text-white border-blue-600 bg-blue-600 hover:bg-blue-500"
                  >
                    {getButtonText(plan.plan_name)}
                  </button>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
