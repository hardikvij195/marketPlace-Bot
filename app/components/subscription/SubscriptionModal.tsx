"use client";
import React, { useState, useEffect } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";

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

export const SubscriptionDialog = ({
  setShowModal,
  setPaymentMethod,
  setSelectedSubscription,
}) => {
  const [plans, setPlans] = React.useState<planState[]>(subscriptionPlans);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const handlePlanSelect = (plan: planState) => {
    setActivePlanId(plan.id);
    const total = Number(plan?.amount) * (1 + 13 / 100);
    setSelectedSubscription({
      ...plan,
      basic_amount: plan?.amount,
      amount: total?.toFixed(2),
    });
    setShowModal(false);
    setPaymentMethod(true);
  };

  
  return (
    <>
      <div className="fixed inset-0 bg-white/10 backdrop-blur-md z-50 flex lg:items-center lg:justify-center md:justify-center md:items-center justify-center lg:mt-0 md:mt-0 mt-2 lg:ml-0 md:ml-0 ml-2">
        <div className="bg-white rounded-lg shadow-lg w-[90%] p-6 overflow-y-auto lg:max-h-[90vh] md:max-h-[90vh] max-h-[140vh] relative">
          <button
            className="absolute lg:text-2xl md:text-3xl text-4xl top-2 right-2 pr-2 text-gray-500 hover:text-gray-800"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>

          <h2 className="text-xl font-bold mb-4 text-center text-gray-900 lg:mt-o md:mt-0 mt-10">
            Thank you for creating your account.
            <br />
            Please subscribe to a subscription plan.
          </h2>

          <div className="bg-[#F9FAFB] text-gray-700">
            <main className="p-4">
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <article
                    key={plan.id}
                    aria-label={`${plan.plan_name} plan $${plan.amount} ${plan.duration}`}
                    className={`border rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                      activePlanId === plan.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-900 border-gray-300"
                    } 
      ${
        index === plans.length - 1
          ? "lg:col-span-3 lg:justify-self-center lg:w-1/3"
          : ""
      } `}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <div>
                      <span
                        className={`inline-block text-xs font-semibold rounded-full px-3 py-1 select-none ${
                          activePlanId === plan.id
                            ? "bg-white text-blue-600"
                            : "text-blue-600 border border-blue-600"
                        }`}
                      >
                        {plan.plan_name}
                      </span>
                      <div className="flex justify-end items-baseline gap-1 mt-2">
                        <span className="text-3xl font-extrabold select-none">
                          ${plan.amount}
                        </span>
                      </div>
                      <div className="text-sm font-normal text-right mt-2 select-none">
                        {plan.type}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlanSelect(plan)}
                      className={`cursor-pointer mt-6 w-full font-semibold text-sm border rounded-md py-2 transition-colors duration-200 ${
                        activePlanId === plan.id
                          ? "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
                          : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      View Plan
                    </button>
                  </article>
                ))}
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
