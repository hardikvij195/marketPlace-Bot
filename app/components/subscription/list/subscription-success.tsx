// pages/payment-success.tsx
"use client";
import { supabaseBrowser } from "../../../../lib/supabaseBrowser";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import SomethingWentWrong from "./subscription_not_found";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("subscription_id");

  useEffect(() => {
    // Log the subscription ID to the console for debugging
    const updatePaymentStatus = async () => {
      if (subscriptionId) {
        if (subscriptionId) {
          const { data } = await supabaseBrowser
            .from("user_subscription")
            .update({
              is_active: true,
              status: "payment_successful", // e.g., "2025-07-05T15:41:23.123Z"
            })
            .eq("id", subscriptionId)
            .select("*, subscription(*)")
            .single();

          if (data) {
            await supabaseBrowser
              .from("users")
              .update({
                subscription: data?.subscription?.plan_name, 
                 commission: data?.subscription?.commission , // e.g., "2025-07-05T15:41:23.123Z"
              })
              .eq("id", data?.user_id)
              .select("*")
              .single();
          }
        }
      }
    };
    if (subscriptionId) {
      updatePaymentStatus();
    }
  }, [subscriptionId]);
  return (
    <>
      {subscriptionId ? (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-4 py-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-md w-full text-center">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={60} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Thank you for your purchase. Your transaction has been completed
              successfully.
            </p>
            <Link
              href="/dashboard/subscription"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Go to Home
            </Link>
          </div>
        </div>
      ) : (
        <SomethingWentWrong />
      )}
    </>
  );
}
