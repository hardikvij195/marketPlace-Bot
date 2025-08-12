"use client";

import { Check, ArrowUpRight, X } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    title: "Trial Run - 2 Days",
    price: "$0.00",
    features1: [
      <Check className="text-green-400 w-4 h-4" key="check1" />,
      "Simple Reply To ask for Phone Number",
    ],
    features2: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "Google Sheet Integration",
    ],
    features3: [
      <X className="text-rose-800 w-4 h-4" key="check3" />,
      "CRM Integration",
    ],
    features4: [
      <X className="text-rose-800 w-4 h-4" key="check4" />,
      "Advanced Prompt with AI",
    ],
    features5: [
      <X className="text-rose-800 w-4 h-4" key="check5" />,
      "Custom Prompt with AI",
    ],
    features6: [
      <X className="text-rose-800 w-4 h-4" key="check6" />,
      "Unlimited Leads Automation",
    ],
    features7: [
      <X className="text-rose-800 w-4 h-4" key="check7" />,
      "AI Calling Setup (Extra 500 USD)",
    ],
    buttonText: "Contact Us",
    type: "contact",
    link: "https://fbmarketplacebots.com/",
  },
  {
    title: "Foundation Pack - 1 Week",
    price: "$30.00",
    features1: [
      <Check className="text-green-400 w-4 h-4" key="check1" />,
      "Simple Reply To ask for Phone Number",
    ],
    features2: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "Google Sheet Integration",
    ],
    features3: [
      <X className="text-rose-800 w-4 h-4" key="check3" />,
      "CRM Integration",
    ],
    features4: [
      <X className="text-rose-800 w-4 h-4" key="check4" />,
      "Advanced Prompt with AI",
    ],
    features5: [
      <X className="text-rose-800 w-4 h-4" key="check5" />,
      "Custom Prompt with AI",
    ],
    features6: [
      <X className="text-rose-800 w-4 h-4" key="check6" />,
      "Unlimited Leads Automation",
    ],
    features7: [
      <X className="text-rose-800 w-4 h-4" key="check7" />,
      "AI Calling Setup (Extra 500 USD)",
    ],
    buttonText: "Buy Now",
    type: "buy",
    link: "https://fbmarketplacebots.com/",
  },
  {
    title: "Growth Engine - 1 Month",
    price: "$100.00",
    features1: [
      <Check className="text-green-400 w-4 h-4" key="check1" />,
      "Simple Reply To ask for Phone Number",
    ],
    features2: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "Google Sheet Integration",
    ],
    features3: [
      <Check className="text-green-400 w-4 h-4" key="check3" />,
      "CRM Integration",
    ],
    features4: [
      <X className="text-rose-800 w-4 h-4" key="check4" />,
      "Advanced Prompt with AI",
    ],
    features5: [
      <X className="text-rose-800 w-4 h-4" key="check5" />,
      "Custom Prompt with AI",
    ],
    features6: [
      <X className="text-rose-800 w-4 h-4" key="check6" />,
      "Unlimited Leads Automation",
    ],
    features7: [
      <X className="text-rose-800 w-4 h-4" key="check7" />,
      "AI Calling Setup (Extra 500 USD)",
    ],
    buttonText: "Buy Now",
    type: "buy",
    link: "https://fbmarketplacebots.com/",
  },
  {
    title: "Ultimate Advantage - 1 Month",
    price: "$300.00",
    features1: [
      <Check className="text-green-400 w-4 h-4" key="check1" />,
      "Simple Reply To ask for Phone Number",
    ],
    features2: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "Google Sheet Integration",
    ],
    features3: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "CRM Integration",
    ],
    features4: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "Advanced Prompt with AI",
    ],
    features5: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "Custom Prompt with AI",
    ],
    features6: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "Unlimited Leads Automation",
    ],
    features7: [
      <Check className="text-green-400 w-4 h-4" key="check2" />,
      "AI Calling Setup (Extra 500 USD)",
    ],
    buttonText: "Buy Now",
    type: "buy",
    link: "https://fbmarketplacebots.com/",
  },
];

export default function Subscriptions() {
  return (
    <section className="py-10 px-4 md:px-12 lg:px-24  text-white">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          Subscriptions
        </h2>
        <p className="text-lg text-black mt-3">
          So What Does It Cost? – Be A Part Of Us!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative  rounded-2xl p-8 shadow-md ${
              plan.special ? "border-2 border-blue-500" : ""
            }`}
          >
            <div className="pt-6 pb-4 text-center">
              <h3 className="text-md font-semibold text-[#2563EB]">
                {plan.title}
              </h3>
              <p className="text-4xl font-bold mt-2 text-[#2563EB]">{plan.price}</p>
            </div>

            <ul className="mt-6 space-y-3 text-black">
              <li className="flex items-center gap-3 text-sm">
                {plan.features1}
              </li>
              <li className="flex items-center gap-3 text-sm">
                {plan.features2}
              </li>
              <li className="flex items-center gap-3 text-sm">
                {plan.features3}
              </li>
              <li className="flex items-center gap-3 text-sm">
                {plan.features4}
              </li>
              <li className="flex items-center gap-3 text-sm">
                {plan.features5}
              </li>
              <li className="flex items-center gap-3 text-sm">
                {plan.features6}
              </li>
              <li className="flex items-center gap-3 text-sm">
                {plan.features7}
              </li>
            </ul>

            <div className="mt-8">
              <Link
                href={plan.link}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-blue-500 text-white font-semibold text-sm hover:opacity-90 transition"
              >
                {plan.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
