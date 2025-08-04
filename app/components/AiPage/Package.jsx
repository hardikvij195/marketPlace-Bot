'use client'

import { useState } from 'react'
import { Check, ArrowUpRight } from 'lucide-react'

const plans = [
  {
    title: 'Free Trial - 2 Days',
    price: '$0.00',
    features: Array(7).fill('Lorem ipsum'),
    buttonText: 'Try Now',
    type: 'contact',
  },
  {
    title: '1 Week',
    price: '$30.00',
    features: Array(7).fill('Lorem ipsum'),
    buttonText: 'Buy Now',
    type: 'buy',
  },
  {
    title: '1 Month',
    price: '$100.00',
    features: Array(7).fill('Lorem ipsum'),
    buttonText: 'Buy Now',
    type: 'buy',
    special: true,
  },
]

export default function Subscriptions() {
  const [activePlan, setActivePlan] = useState(1)

  return (
    <section className="py-20 px-4 md:px-12 lg:px-24 text-black">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold">Subscriptions</h2>
        <p className="text-md text-black mt-3">
          So What Does It Cost? – Be A Part Of Us!
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            onClick={() => setActivePlan(idx)}
            className={`relative rounded-2xl p-8 shadow-lg cursor-pointer transition-colors duration-200
              ${activePlan === idx ? 'border-2 border-[#2563EB]' : 'border-2 border-transparent'}`}
          >
            {plan.special && activePlan === idx && (
              <div className="absolute top-0 left-0 right-0 bg-[#2563EB] text-center text-white py-2 rounded-t-2xl font-semibold">
                Special Offer
              </div>
            )}

            <div className="pt-6 pb-4 text-center">
              <h3 className="text-xl font-semibold text-[#2563EB]">{plan.title}</h3>
              <p className="text-4xl font-bold mt-2 text-[#2563EB]">{plan.price}</p>
            </div>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="text-green-400 w-4 h-4" />
                  {feat}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold text-sm transition hover:opacity-90
                  ${activePlan === idx
                    ? 'bg-[#2563EB] text-white'
                    : 'text-black border border-[#2563EB] bg-white'
                  }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}