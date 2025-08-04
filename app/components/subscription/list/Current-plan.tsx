"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { User, Mail, Settings, Lock, Trash2, Loader } from "lucide-react";
import moment from "moment";

export default function CurrentPlan({
  subscriptionData,
}: {
  subscriptionData: any;
}) {
  const router = useRouter();
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center space-x-3">
          <span>Current Plan</span>
          <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-1 text-green-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1" />
            Active
          </span>
        </h3>
        {/* <button className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-md px-3 py-2 hover:bg-blue-200">
          <Mail className="w-4 h-4" />
          <span>Invoice (PDF)</span>
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 mb-6 text-sm text-gray-700">
        <InfoItem
          label="Plan Name"
          value={subscriptionData?.subscription?.plan_name}
        />
        <InfoItem
          label="Commission Rate"
          value={`${subscriptionData?.subscription?.commission}%`}
        />
        <InfoItem
          label="Amount Paid"
          value={`$${subscriptionData?.subscription?.amount}/month`}
        />
        <InfoItem
          label="Started On"
          value={moment(
            new Date(subscriptionData?.start_date)
          ).format("MMM DD, YYYY")}
        />
        <InfoItem
          label="Renews On"
          value={moment(
            new Date(subscriptionData?.end_date)
          ).format("MMM DD, YYYY")}
        />
      </div>

      <div className="text-sm text-gray-700 mb-6">
        <p className="font-semibold mb-2">Plan Benefits</p>
        <ul className="space-y-1">
          {[
            "Access to Deal Calculator",
            "Submit Monthly Invoice & Earn Commission",
            `Commission Rate: ${subscriptionData?.subscription?.commission||20}%`,
            "Monthly Support & Coaching",
          ].map((benefit) => (
            <li key={benefit} className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-sm inline-block" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* <div className="flex justify-end">
        <button
          onClick={() => router?.push("/dashboard/subscription-buy")}
          className="cursor-pointer text-gray-700 text-sm font-semibold border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100"
        >
          Upgrade Plan
        </button>
      </div> */}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p>{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
