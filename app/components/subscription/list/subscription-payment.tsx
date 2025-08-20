"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { supabaseBrowser } from "../../../../lib/supabaseBrowser";
import { showToast } from "../../../../hooks/useToast";
import Link from "next/link";


export default function SubscriptionPayment({
  selectedSubscription,
  handleCancelPayment,
  setPaymentMethod,
}: {
  selectedSubscription: any;
  handleCancelPayment: () => void;
  setPaymentMethod: (value: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState();
  const { user } = useSelector((state: any) => state?.user);
  const [promoCode, setPromoCode] = useState("");
  const [message, setMessage] = useState("");
  const [discount, setDiscount] = useState<number | null>(null);
  const selectedPlan = selectedSubscription?.plan_name;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      return setMessage("Please enter a promo code.");
    }

    const { data, error } = await supabaseBrowser
      .from("promos")
      .select("*")
      .eq("code", promoCode.trim())
      .contains("plans", [selectedPlan])
      .maybeSingle();

    if (error || !data) {
      return setMessage("Invalid or expired promo code.");
    }

    const validDate = data.valid_date;
    const validTime = data.valid_time;

    const combinedDateTimeStr = `${validDate}T${convertTo24HourFormat(
      validTime
    )}`;

    const validUntil = new Date(combinedDateTimeStr);
    const now = new Date();

    if (now > validUntil) {
      return setMessage("Promo code has expired.");
    }

    setDiscount(data.discount);
    setMessage(`Promo applied! Discount: ${data.discount}%`);
  };

  function convertTo24HourFormat(timeStr: string) {
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:00`;
    }
    return timeStr;

  }

  

const handlePayment = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {

    
    // Step 1: deactivate old active subscription if any
    const supdata = await supabaseBrowser
      .from("user_subscription")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (supdata?.data) {
      await supabaseBrowser
        .from("user_subscription")
        .update({
          is_active: false,
          status: "payment_failed",
        })
        .eq("id", supdata?.data?.id)
        .select()
        .single();
    }

    // Step 2: create pending subscription record
   // Step 2: create pending subscription record
const start_date = new Date();
const endDate = new Date(start_date);

if (selectedSubscription?.plan_name === "Foundation Pack") {
  endDate.setDate(endDate.getDate() + 7); // 7 days
} else {
  endDate.setMonth(endDate.getMonth() + 1); // 1 month
}

const payload = {
  user_id: user?.id,
  subscription_id: selectedSubscription?.id,
  start_date: start_date.toISOString(),
  end_date: endDate.toISOString(),
  status: "payment_pending",
  amount: selectedSubscription?.amount,
};


    const { data, error } = await supabaseBrowser
      .from("user_subscription")
      .insert([payload])
      .select("*");

    if (error) throw new Error("Supabase insert failed");

    // Step 3: Call your PayPal API route instead of Stripe
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_id: data?.[0]?.id,
        amount: selectedSubscription?.amount,
        user_id: user?.id,
        name: user?.user_metadata?.full_name,
        email: user?.email,
      }),
    });

    const Subdata = await res.json();
 


    if (Subdata?.paymentId) {
  // Update the subscription row with PayPal payment ID
  await supabaseBrowser
    .from("user_subscription")
    .update({ payment_id: Subdata.paymentId })
    .eq("id", data?.[0]?.id); 
}


    // Step 4: Redirect user to PayPal approval page
    if (Subdata?.approvalUrl) {
      window.location.href = Subdata.approvalUrl;
    } else {
      showToast({
        title: "error",
        description: "Error creating PayPal order.",
      });
      setLoading(false);
    }
  } catch (error) {
    console.error("Payment Error:", error);
    showToast({
      title: "error",
      description: "Error creating session.",
    });
    setLoading(false);
  }
};


  return (
    <main className="bg-white text-[#111827] min-h-screen flex flex-col px-4 sm:px-8 py-6">
      <nav className="text-sm text-gray-500 mb-4 select-none">
        <ArrowLeft className="inline-block cursor-pointer mr-2" size={20} onClick={() => setPaymentMethod(false)} />
        <Link
          href="/dashboard/subscription"
          className="hovertext-blue-600 cursor-pointer hover:underline"
        >
          Subscription
        </Link>
        <span className="mx-2">&gt;</span>
        <Link
          href="/dashboard/subscription-buy"
          className="hovertext-blue-600 cursor-pointer hover:underline"
          onClick={() => setPaymentMethod(false)}
        >
          Plan
        </Link>
        <span className="mx-2">&gt;</span>
        <a href="#" className="text-blue-600 font-semibold hover:underline">
          Payment
        </a>
      </nav>

      <section className="max-w-2xl w-full mx-auto">
        <h2 className="text-gray-900 font-semibold text-lg mb-4 select-none">
          Choose Payment Method
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full text-sm bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <tbody>
              <tr className="border-b border-b-gray-300 hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-700">
                  Selected Plan
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  {selectedSubscription?.plan_name} 
                 
                </td>
              </tr>
              <tr className="border-b border-b-gray-300 hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-700">
                  Amount to Pay
                </td>
                <td className="px-6 py-4 text-right text-blue-600 font-bold text-lg">
                  ${selectedSubscription?.amount}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-700">Total</td>
                <td className="px-6 py-4 text-right text-blue-700 font-extrabold text-xl">
                  $
                  {(
                    selectedSubscription?.amount -
                    (selectedSubscription?.amount * (discount ?? 0)) / 100
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Promo code input + Save button */}
          {/*<div className="flex items-center gap-2 m-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <div
              onClick={() => {
                setDiscount(0);
                setPromoCode("");
                setMessage("");
              }}
              className="border-2 border-blue-500 hover:bg-gray-200 cursor-pointer px-4 py-2 text-sm rounded-md"
            >
              Cancel
            </div>
            <div
              onClick={handleApplyPromo}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md"
            >
              Apply
            </div>
          </div>
          {message && (
            <p
              className={`${
                !message.includes("Discount") ? "text-red-500" : "text-blue-500"
              } mt-2`}
            >
              {message}
            </p>
          )}
            */}
        </div> 

        <h3 className="text-gray-900 font-semibold text-base mb-4 select-none">
          Select Payment Method
        </h3>

        <form>
          <fieldset className="flex flex-col gap-4">
            {paymentOptions.map((option: any) => (
              <label
                key={option.id}
                htmlFor={option.id}
                className="flex items-center gap-4 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  id={option.id}
                  name="payment"
                  checked={selected === option.id}
                  onChange={() => setSelected(option.id)}
                  className="w-4 h-4 text-blue-600 border-gray-200 focus:ring-blue-600"
                />
                <img
                  src={option.img}
                  alt={option.alt}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-md border border-gray-200 bg-white p-1"
                />
                <span
                  className={`text-gray-900 text-sm ${
                    option.bold ? "font-semibold" : ""
                  }`}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </fieldset>

          <div className="mt-12 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => handleCancelPayment()}
              disabled={loading}
              className="cursor-pointer px-6 py-2 border border-red-600 text-red-600 rounded-md text-sm font-normal hover:bg-red-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(event) => handlePayment(event)}
              disabled={loading}
              className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-normal hover:bg-blue-700 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Proceed to Payment
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const paymentOptionsold = [
  {
    id: "gopay",
    label: "Gopay",
    img: "https://storage.googleapis.com/a1aa/image/05772110-44ca-4ac6-ff5b-30de5c7a16dd.jpg",
    alt: "Gopay logo, blue and white icon",
  },
  {
    id: "shopeepay",
    label: "Shopeepay",
    img: "https://storage.googleapis.com/a1aa/image/a67672c9-6250-4539-e725-9586c51a5856.jpg",
    alt: "ShopeePay logo, red and white icon",
  },
  {
    id: "paypal",
    label: "PayPal",
    img: "https://storage.googleapis.com/a1aa/image/207ba434-9bb3-4b65-d147-6d9c1b9bea5d.jpg",
    alt: "PayPal logo, blue and white icon",
    bold: true,
  },
  {
    id: "debit",
    label: "Debit/Credit Card",
    img: "https://storage.googleapis.com/a1aa/image/15c29a88-68c0-43ef-6c1a-aae94f02ff77.jpg",
    alt: "Visa and MasterCard logos combined",
  },
];

const paymentOptions = [
  {
    id: "paypal",
    label: "PayPal",
    img: "https://www.paypalobjects.com/webstatic/icon/pp258.png", // official PayPal icon
    alt: "PayPal logo",
  },
];
