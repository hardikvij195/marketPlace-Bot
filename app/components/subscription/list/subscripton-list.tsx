// app/subscription/page.tsx or any route you prefer
"use client";

import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

type planState = {
  plan_name: string;
  id: string;
  type: string;
  amount: string;
  duration: string;
  basic_amount?: string;
};


const subscriptionPlans: planState[] = [
  {
    id: "plan_1",
    plan_name: "Trial Run",
    type: "trial",
    amount: "0.00",
    duration: "For 2days",
  },
  {
    id: "plan_2",
    plan_name: "Foundation Pack",
    type: "monthly",
    amount: "30.00",
    duration: "For 1 Week",
  },
  {
    id: "plan_3",
    plan_name: "Growth Engine",
    type: "monthly",
    amount: "100.00",
    duration: "For 1 Month",
  },
   {
    id: "plan_4",
    plan_name: "Ultimate Advantage",
    type: "monthly",
    amount: "300.00",
    duration: "For 1 Month",
  },
];

export default function SubscriptionListPage({
  handleShowPayment,
}: {
  handleShowPayment: (plan: planState) => void;
}) {
  // We are using a hardcoded array, so we don't need to fetch data.
  // The plans are ready to be used directly.
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const handlePlanSelect = (plan: planState) => {
    setActivePlanId(plan.id);
    handleShowPayment(plan);
  };

  return (
    <div className="bg-[#F9FAFB] text-gray-700 min-h-screen flex">
      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="mb-4 text-sm text-gray-600 select-none">
          <Link href={"/dashboard/subscription"}>
            <ArrowLeft
              className="inline-block cursor-pointer mr-2"
              size={20}
            />
          </Link>
          <Link
            href="/dashboard/subscription"
            className="hovertext-blue-600 cursor-pointer hover:underline"
          >
            Subscription
          </Link>
          <span className="mx-2">&gt;</span>
          <a
            href="#"
            className="text-blue-600 font-semibold hover:underline"
          >
            Plan
          </a>
        </div>

        <h1 className="text-gray-900 font-bold text-lg mb-6 select-none">
          Choose a New Plan
        </h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {subscriptionPlans.map((plan) => (
            <article
              key={plan.id}
              aria-label={`${plan.plan_name} plan $${plan.amount} ${plan.duration}`}
              className={`border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                activePlanId === plan.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              <div>
                <span className={`inline-block text-xs font-semibold rounded-full px-3 py-1 select-none ${
                    activePlanId === plan.id
                      ? "bg-white text-blue-600"
                      : "text-blue-600 border border-blue-600"
                }`}>
                  {plan.plan_name}
                </span>
                <div className="flex justify-end items-baseline gap-1 mt-2">
                  <span className="text-xl font-extrabold select-none">
                    ${plan.amount}
                  </span>
                  <span className="text-sm font-normal text-right select-none">
                    /month
                  </span>
                </div>
                <div className="text-sm font-normal text-right mt-1 select-none">
                  {plan.duration}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handlePlanSelect(plan)}
                className={`cursor-pointer mt-6 w-full font-semibold text-sm border rounded-md py-2 transition-colors duration-200 ${
                  activePlanId === plan.id
                    ? "bg-white text-blue-600 hover:bg-gray-100"
                    : "text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                SubScribe
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
