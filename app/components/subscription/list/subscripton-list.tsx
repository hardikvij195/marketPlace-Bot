// app/subscription/page.tsx
"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabaseBrowser } from "../../../../lib/supabaseBrowser";
import { showToast } from "../../../../hooks/useToast";

type PlanState = {
  id: string;
  plan_name: string;
  amount: string;
  type: string;
  duration?: string;
};

type Feature = { text: string; included: boolean };

const featuresMap: Record<string, { features: Feature[] }> = {
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

export default function SubscriptionListPage({
  handleShowPayment,
}: {
  handleShowPayment: (plan: PlanState) => void;
}) {
  const [plans, setPlans] = useState<PlanState[]>([]);
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

        const formattedPlans: PlanState[] = (data as any[]).map((plan) => ({
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
        console.error("[SubscriptionListPage] Error fetching plans:", error);
        showToast({
          title: "Error",
          description: "Failed to load subscription plans.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const checkActiveSubscription = async (
    userId: string
  ): Promise<{ hasActive: boolean; planName?: string }> => {
    try {
      const { data, error } = await supabaseBrowser
        .from("user_subscription")
        .select("id, subscription:subscription_id(plan_name)")
        .eq("user_id", userId)
        .eq("is_active", true)
        .limit(1);

      if (error) throw error;

      if (data.length > 0) {
        return { hasActive: true, planName: data[0].subscription.plan_name };
      }
      return { hasActive: false };
    } catch (error: any) {
      console.error(
        "[SubscriptionListPage] Error checking active subscription:",
        error
      );
      showToast({
        title: "Error",
        description: "Failed to check existing subscriptions.",
      });
      return { hasActive: false };
    }
  };

  const checkPreviousFreeTrial = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabaseBrowser
        .from("user_subscription")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "payment_successful")
        .limit(1);

      if (error) throw error;

      return data.length > 0;
    } catch (error: any) {
      console.error(
        "[SubscriptionListPage] Error checking previous free trial:",
        error
      );
      showToast({
        title: "Error",
        description: "Failed to check previous free trials.",
      });
      return false;
    }
  };

  const handlePlanSelect = async (
    plan: PlanState,
    event?: React.MouseEvent
  ) => {
    if (event) event.stopPropagation();

    setActivePlanId(plan.id);

    const {
      data: { user },
      error: userError,
    } = await supabaseBrowser.auth.getUser();

    if (userError || !user) {
      showToast({
        title: "Error",
        description: "You must be logged in to select a plan.",
      });
      return;
    }

    const { hasActive, planName } = await checkActiveSubscription(user.id);
    if (hasActive) {
      showToast({
        title: "Error",
        description: `You already have an active subscription: ${planName}. Please cancel your current subscription before selecting a new plan.`,
      });
      return;
    }

    // ✅ Handle Free Trial
    if (plan.type === "2") {
      const hasPreviousFreeTrial = await checkPreviousFreeTrial(user.id);
      if (hasPreviousFreeTrial) {
        showToast({
          title: "Error",
          description:
            "You have already used your free trial. Please choose a paid plan.",
        });
        return;
      }

      try {
        const startDate = new Date();
        const endDate = new Date(startDate);

        // Foundation Pack → 7 days, otherwise 2 days
        if (plan.plan_name === "Foundation Pack") {
          endDate.setDate(endDate.getDate() + 7);
        } else {
          endDate.setDate(endDate.getDate() + 2);
        }

        const { error } = await supabaseBrowser
          .from("user_subscription")
          .insert({
            user_id: user.id,
            subscription_id: plan.id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: "payment_successful", // better to track trial separately
            is_active: true,
            amount: 0, // trial = free
          });

        if (error) throw error;

        // ✅ Redirect to subscription success
        window.location.href = `/dashboard/subscription-buy/success?subscription_id=${plan.id}&token=TRIAL123&PayerID=TRIALUSER`;

        return;
      } catch (error: any) {
        console.error("Error starting trial:", error);
        showToast({
          title: "Error",
          description: "Failed to activate trial.",
        });
        return;
      }
    }

    // ✅ Handle Paid Plans
    handleShowPayment(plan);
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
    <div className="bg-white text-gray-700 min-h-screen flex">
      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="mb-4 text-sm text-gray-600 select-none">
          <Link href={"/dashboard/subscription"}>
            <ArrowLeft className="inline-block cursor-pointer mr-2" size={20} />
          </Link>
          <Link
            href="/dashboard/subscription"
            className="hover:text-blue-600 cursor-pointer hover:underline"
          >
            Subscription
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-blue-600 font-semibold hover:underline">
            Plan
          </span>
        </div>

        <h1 className="text-gray-900 font-bold text-lg mb-6 select-none mt-6">
          Choose a New Plan
        </h1>

        {loading ? (
          <div className="text-center text-gray-600">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center text-gray-600">
            No subscription plans available.
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
            {plans.map((plan) => {
              const planFeatures = featuresMap[plan.plan_name]?.features;
              return (
                <article
                  key={plan.id}
                  aria-label={`${plan.plan_name} plan $${plan.amount} ${plan.duration}`}
                  className={`border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                    activePlanId === plan.id ? "" : ""
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`inline-block text-xs font-semibold rounded-full px-3 py-1 select-none ${
                          activePlanId === plan.id
                            ? "text-blue-600 border border-blue-600"
                            : "text-blue-600 border border-blue-600"
                        }`}
                      >
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

                    {/* Features List */}
                    {planFeatures && (
                      <ul className="mt-4 space-y-2 text-sm text-gray-600">
                        {planFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            {feature.included ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <X className="w-4 h-4 text-rose-800" />
                            )}
                            <span>{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handlePlanSelect(plan, e)}
                    className={`cursor-pointer mt-6 w-full font-semibold text-sm border rounded-md py-2 transition-colors duration-200 ${
                      activePlanId === plan.id
                        ? "bg-blue-600 text-blue-600 hover:bg-gray-100"
                        : "text-white border-blue-600 bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    {getButtonText(plan.plan_name)}
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
