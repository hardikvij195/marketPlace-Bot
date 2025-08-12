// app/api/create-checkout-session/route.ts

import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API = process.env.PAYPAL_API!;

interface PayPalAccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface PayPalOrderLink {
  href: string;
  rel: string;
  method: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: PayPalOrderLink[];
}

async function generateAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = (await response.json()) as PayPalAccessTokenResponse;
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const origin = req.headers.get("origin") || "http://localhost:3000";

  try {
    const accessToken = await generateAccessToken();

    const order = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: body.price, // You can dynamically use body.price
            },
            custom_id: body.user_id,
          },
        ],
        application_context: {
          return_url: `${origin}/dashboard/subscription-buy/success?subscription_id=${body.plan_id}`,
          cancel_url: `${origin}/dashboard/subscription-buy/cancel?subscription_id=${body.plan_id}`,
        },
      }),
    });

    const orderData = (await order.json()) as PayPalOrderResponse;

    const approvalUrl = orderData.links.find(link => link.rel === "approve")?.href;

    return NextResponse.json({
      url: approvalUrl,
      orderId: orderData.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
