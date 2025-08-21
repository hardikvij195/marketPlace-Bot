// app/subscription/page.tsx
"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabaseBrowser } from "../../../../lib/supabaseBrowser";
import { showToast } from "../../../../hooks/useToast";
import { useRouter } from "next/navigation";

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
  const [showTrialConfirm, setShowTrialConfirm] = useState(false);
  const [selectedTrialPlan, setSelectedTrialPlan] = useState<PlanState | null>(
    null
  );
  const router = useRouter();
  const [trialUsed, setTrialUsed] = useState(false);

  const callWebhook = async (payload: any) => {
    try {
      const res = await fetch(
        "https://hook.eu2.make.com/l6tijvex2p2plkdojf1hofciarpmshep",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        console.error("Webhook call failed:", res.statusText);
      }
    } catch (err) {
      console.error("Error calling webhook:", err);
    }
  };

  useEffect(() => {
    const fetchPlansAndSubscription = async () => {
      try {
        // Fetch plans
        const { data: plansData, error: plansError } = await supabaseBrowser
          .from("subscription")
          .select("*")
          .order("sort_order", { ascending: true });

        if (plansError) throw plansError;

        const formattedPlans: PlanState[] = (plansData as any[]).map(
          (plan) => ({
            id: plan.id,
            plan_name: plan.plan_name,
            amount: plan.amount || "0", // Default to "0" if amount is null/undefined
            type: plan.type,
            duration:
              plan.type === "2"
                ? "For 2 days"
                : plan.type === "week"
                ? "For 1 week"
                : "For 1 month",
          })
        );

        setPlans(formattedPlans);

        // Fetch active subscription
        const { data: userData } = await supabaseBrowser.auth.getUser();
        if (userData.user) {
          const { data: subscriptionData, error: subscriptionError } =
            await supabaseBrowser
              .from("user_subscription")
              .select("subscription_id")
              .eq("user_id", userData.user.id)
              .eq("is_active", true)
              .limit(1);

          if (subscriptionError) throw subscriptionError;

          if (subscriptionData.length > 0) {
            setActivePlanId(subscriptionData[0].subscription_id);
          }

          const { data: userRow, error: userError } = await supabaseBrowser
            .from("users")
            .select("trial_used")
            .eq("id", userData.user.id)
            .single();

          if (!userError && userRow) {
            setTrialUsed(userRow.trial_used === true);
          }
        }
      } catch (error: any) {
        console.error("[SubscriptionListPage] Error:", error);
        showToast({
          title: "Error",
          description:
            "Failed to load subscription plans or active subscription.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlansAndSubscription();
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

  const handlePlanSelect = async (plan: PlanState, event?: React.MouseEvent) => {
  if (event) event.stopPropagation();

  const {
    data: { user },
    error: userError,
  } = await supabaseBrowser.auth.getUser();
  if (userError || !user) {
    showToast({
      title: "Error",
      description: "You must be logged in to select a plan.",
      type: "error",
    });
    return;
  }

  const { hasActive, planName: activePlanName } = await checkActiveSubscription(user.id);

  // Find numeric amount of current plan and selected plan
  const activePlan = plans.find((p) => p.plan_name === activePlanName);
  const isNumericAmount =
    !isNaN(Number(plan.amount)) &&
    activePlan &&
    !isNaN(Number(activePlan.amount));

  // If user has active plan
  if (hasActive && isNumericAmount) {
    if (Number(plan.amount) <= Number(activePlan.amount)) {
      showToast({
        title: "Error",
        description: `You already have an active subscription: ${activePlanName}. Please cancel it first to select this plan.`,
        type: "error",
      });
      return; // block lower or equal plan
    }
    // Otherwise, allow upgrading
  }

  // Handle-trial plan selection
  if (plan.type === "2") {
    const hasPreviousFreeTrial = await checkPreviousFreeTrial(user.id);
    if (hasPreviousFreeTrial) {
      showToast({
        title: "Error",
        description: "You already used your free trial. Please choose a paid plan.",
        type: "error",
      });
      return;
    }

    setSelectedTrialPlan(plan);
    setShowTrialConfirm(true);
    return;
  }

  // Paid plan (upgrade or new)
  handleShowPayment(plan);
};


  const handleConfirmTrial = async () => {
    if (!selectedTrialPlan) return;

    try {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      const startDate = new Date();
      const endDate = new Date(startDate);

      if (selectedTrialPlan.plan_name === "Foundation Pack") {
        endDate.setDate(endDate.getDate() + 7);
      } else {
        endDate.setDate(endDate.getDate() + 2);
      }

      // ✅ Update user trial details
      await supabaseBrowser
        .from("users")
        .update({
          fb_chatbot_trail_start_date: startDate.toISOString(),
          fb_chatbot_trail_expiry_date: endDate.toISOString(),
          fb_chatbot_trail_active: true,
          trial_used: true,
          fb_chatbot_subscription_name: selectedTrialPlan?.plan_name,
          subscription: selectedTrialPlan?.plan_name,
        })
        .eq("id", user.id);

      // ✅ Insert trial subscription
      const { data: subscriptionRow, error: subError } = await supabaseBrowser
        .from("user_subscription")
        .insert({
          user_id: user.id,
          subscription_id: selectedTrialPlan.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: "payment_successful",
          is_active: true,
          amount: 0,
        })
        .select("*")
        .single();

        showToast ({title: "Please Wait", description:"Please wait for 5 mins for the google sheet to be created", type: "error" })

      if (subError) {
        console.error("Error inserting user_subscription:", subError);
        return;
      }

      // ✅ Call webhook with all user + subscription details
      await callWebhook({
        userId: user.id,
        subscriptionId: subscriptionRow.id,
        planId: selectedTrialPlan.id,
        planName: selectedTrialPlan.plan_name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount: 0,
        trial: true,
      });

      // ✅ Insert free trial invoice (if not already created)
      const { data: existingInvoice } = await supabaseBrowser
        .from("invoice")
        .select("*")
        .eq("invoiceId", subscriptionRow.id) // using subscription id as invoiceId
        .maybeSingle();

      if (!existingInvoice) {
        const invoicePayload = {
          invoiceId: subscriptionRow.id,
          dateOfSale: new Date().toISOString(),
          plan_name: selectedTrialPlan.plan_name,
          amount: 0,
          salesName: user.id, // keeping user_id as sales reference
        };

        const { error: invoiceError } = await supabaseBrowser
          .from("invoice")
          .insert([invoicePayload]);

        if (invoiceError) {
          console.error("Error inserting invoice:", invoiceError);
        }
      }

      showToast({
        title: "Success",
        description: "Your free trial has been activated 🎉",
      });

      setShowTrialConfirm(false);
      setSelectedTrialPlan(null);
      setActivePlanId(selectedTrialPlan.id);
      router.push("/dashboard/subscription");
    } catch (error: any) {
      console.error("Error starting trial:", error);
      showToast({
        title: "Error",
        description: "Failed to activate trial.",
      });
    }
  };

  const getButtonText = (planName: string) => {
    switch (planName) {
      case "Trial Run":
        return "Start Trial";
      case "Foundation Pack":
      case "Growth Engine":
        return "Buy Now";
      case "Ultimate Advantage":
        return "Buy Now";
      default:
        return "Subscribe";
    }
  };

  return (
    <div className="bg-white text-gray-700 min-h-screen flex">
      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="mb-4 text-sm text-gray-600 select-none">
          <Link href="/dashboard/subscription">
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
              const activePlan = plans.find((p) => p.id === activePlanId);
              const isNumericAmount =
                !isNaN(Number(plan.amount)) &&
                !isNaN(Number(activePlan?.amount || "0"));
              const shouldDisable =
                activePlan &&
                (plan.id === activePlanId ||
                  (isNumericAmount &&
                    Number(plan.amount) < Number(activePlan.amount)));

              return (
                <article
                  key={plan.id}
                  aria-label={`${plan.plan_name} plan $${plan.amount} ${plan.duration}`}
                  className={`border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                    activePlanId === plan.id ? "border-blue-600" : ""
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`inline-block text-xs font-semibold rounded-full px-3 py-1 select-none ${
                          activePlanId === plan.id
                            ? "text-blue-600 border border-blue-600"
                            : "text-gray-600 border border-gray-200"
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
                       {plan.amount}
                      </span>
                    </div>

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
                    disabled={
                      shouldDisable || (trialUsed && plan.type === "2") 
                    }
                    className={`mt-6 w-full font-semibold text-sm border rounded-md py-2 transition-colors duration-200 ${
                      shouldDisable || (trialUsed && plan.type === "2")
                        ? "bg-gray-300 text-gray-500 border-gray-200 cursor-not-allowed"
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
      {showTrialConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Start Free Trial?</h2>
            <p className="text-sm text-gray-600 mb-6">
              You are about to start your free trial for{" "}
              <span className="font-bold">{selectedTrialPlan?.plan_name}</span>.
              Do you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowTrialConfirm(false)}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTrial}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
