// app/subscription/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
import { Check, X } from "lucide-react";

type planState = {
  plan_name: string;
  id: string;
  type: string;      // "2" = trial
  amount: string;
  duration: string;
  basic_amount?: string;
};

type Feature = { text: string; included: boolean };

// Static features mapped to plan names
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
  const [trialUsed, setTrialUsed] = useState(false);

  // 🔔 New: local confirmation modal state
  const [showTrialConfirm, setShowTrialConfirm] = useState(false);
  const [selectedTrialPlan, setSelectedTrialPlan] = useState<planState | null>(null);

  // 🔔 New: webhook helper (same as your page.tsx)
  const callWebhook = async (payload: any) => {
    try {
    
      const res = await fetch(
        "https://hook.eu2.make.com/l6tijvex2p2plkdojf1hofciarpmshep",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const responseText = await res.text();
   
      if (!res.ok) {
        console.error("Webhook call failed:", res.statusText);
      }
    } catch (err) {
      console.error("❌ Error calling webhook:", err);
    }
  };

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

  useEffect(() => {
    const checkTrial = async () => {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();
      if (!user) return;
      const { data } = await supabaseBrowser
        .from("users")
        .select("trial_used")
        .eq("id", user.id)
        .single();
      if (data?.trial_used) setTrialUsed(true);
    };
    checkTrial();
  }, []);

  // 🔔 New: confirm trial logic (same as your page.tsx)
  const handleConfirmTrial = async () => {
    if (!selectedTrialPlan) return;

    try {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      const startDate = new Date();
      const endDate = new Date(startDate);
      // "Trial Run" = 2 days here. If you also support 7-day trial in modal, adjust accordingly.
      endDate.setDate(endDate.getDate() + 2);

      // ✅ Update user row
      await supabaseBrowser
        .from("users")
        .update({
          fb_chatbot_trail_start_date: startDate.toISOString(),
          fb_chatbot_trail_expiry_date: endDate.toISOString(),
          fb_chatbot_trail_active: true,
          trial_used: true,
          fb_chatbot_subscription_name: selectedTrialPlan.plan_name,
          subscription: selectedTrialPlan.plan_name,
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

      if (subError) {
        console.error("Error inserting user_subscription:", subError);
        return;
      }



      // ✅ Call webhook (same payload shape)
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
        .eq("invoiceId", subscriptionRow.id)
        .maybeSingle();

      if (!existingInvoice) {
        await supabaseBrowser.from("invoice").insert([
          {
            invoiceId: subscriptionRow.id,
            dateOfSale: new Date().toISOString(),
            plan_name: selectedTrialPlan.plan_name,
            amount: 0,
            salesName: user.id,
          },
        ]);
      }

   

      setShowTrialConfirm(false);
      setSelectedTrialPlan(null);
      setActivePlanId(selectedTrialPlan.id);
      setTrialUsed(true);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error starting trial:", error);
    }
  };

  const handlePlanSelect = async (plan: planState) => {
    if (plan.type === "2") {
      if (trialUsed) {
       
        return;
      }
      // Open confirmation first (don’t start immediately)
      setSelectedTrialPlan(plan);
      setShowTrialConfirm(true);
    } else {
      setActivePlanId(plan.id);
      setSelectedSubscription(plan);
      setShowModal(false);
      setPaymentMethod(true);
    }
  };

  const getButtonText = (planName: string) => {
    switch (planName) {
      case "Trial Run":
        return "Start Trial";
      case "Foundation Pack":
      case "Growth Engine":
      case "Ultimate Advantage":
        return "Buy Now";
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
                    disabled={plan.type === "2" && trialUsed}
                    className={`cursor-pointer mt-6 w-full font-semibold text-sm border rounded-md py-2 transition-colors duration-200
                      ${
                        plan.type === "2" && trialUsed
                          ? "bg-gray-400 border-gray-400 text-white cursor-not-allowed"
                          : "text-white border-blue-600 bg-blue-600 hover:bg-blue-500"
                      }`}
                  >
                    {getButtonText(plan.plan_name)}
                  </button>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>

      {/* 🔔 New: Trial confirmation modal */}
      {showTrialConfirm && selectedTrialPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[60]">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Start Free Trial?</h2>
            <p className="text-sm text-gray-600 mb-6">
              You are about to start your free trial for{" "}
              <span className="font-bold">{selectedTrialPlan.plan_name}</span>.
              Do you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowTrialConfirm(false);
                  setSelectedTrialPlan(null);
                }}
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
};
