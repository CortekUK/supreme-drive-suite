# Stripe Integration Code

## Overview
This document contains all Stripe integration code from the aurotry-web application.

---

## 1. Stripe Configuration

**File:** `src/config/stripe.ts`

```typescript
import Stripe from 'stripe';

// @ts-ignore - Ignore type checking for the Stripe API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51OpazCHw4aNq4gdL99oVUwGTkdiLzNhby0MvyxRNsnqQ7dPrnWgaxp7yktrkyU3qs0ccJcQWoAQCHQt03FYDcC2U00Z2UgN1sJ');

export default stripe;
```

---

## 2. API Route - Create Checkout Session

**File:** `src/app/api/create-checkout-session/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/config/stripe";

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const origin = headersList.get("origin") || "";
  const { buildID, buildName, bill } = await req.json();

  console.log("------------------------------");
  console.log(buildID, buildName);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: buildName,
            },
            unit_amount: bill * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/thank-you`,
      cancel_url: `${origin}/purchase-failed`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error creating checkout session" });
  }
}
```

---

## 3. Frontend Payment Layout Component

**File:** `src/components/dashboard/payment/payment-layout.tsx`

```typescript
"use client";
import React, { useState } from "react";
import { WalletCards, ShoppingCart } from "lucide-react";
import Icon from "../svg-icon";
import { PaymentLayoutProps } from "@/types/payment-layout-types";
import ChangePlan from "./change-plan";
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51OpazCHw4aNq4gdLwqocQbL63yx3IiQHUtQAUvR8oKI9zD2wLStLgx64lUOnmZ2y7TCgwayOM2rlr6K1oKman9Ht00Ecl9KJP9');

export function PaymentLayout({
  planName,
  billingCycle,
  amount,
  startDate,
  nextBillingDate,
  onProceed,
  onChangePlan,
}: PaymentLayoutProps) {
  // STATES
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Extract amount value (remove currency symbol and convert to number)
  const extractAmount = () => {
    const numericAmount = amount.replace(/[^0-9.]/g, '');
    return parseFloat(numericAmount);
  };

  // Handle payment submission
  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buildID: planName,
          buildName: `${planName} - ${billingCycle}`,
          bill: extractAmount()
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        console.error('Error creating checkout session:', error);
        setIsLoading(false);
        return;
      }

      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (err) {
      console.error('Payment processing error:', err);
    } finally {
      setIsLoading(false);
    }

    if (onProceed) {
      onProceed();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col bg-white px-4 md:px-8 py-5 md:py-10 rounded-lg order-last lg:order-first">
          <h2 className="text-xl font-semibold">Select Payment Method</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                paymentMethod === "card"
                  ? "border-[#758BFD] text-black font-semibold"
                  : "border-gray-200 hover:border-gray-300 text-gray-400 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  name="card"
                  alt="Payment card picture"
                  width={24}
                  height={24}
                />
                <span className="text-[14px]">Credit / Debit card</span>
              </div>
              {paymentMethod === "card" ? (
                <Icon name="target" width={18} height={18} />
              ) : (
                <Icon name="unchecked" alt="unchecked" width={18} height={18} />
              )}
            </button>

            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`flex items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                paymentMethod === "wallet"
                  ? "border-[#758BFD] text-black font-semibold"
                  : "border-gray-200 hover:border-gray-300 text-gray-400 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <WalletCards className="w-6 h-6" />
                <span className="text-[14px]">Digital Wallet</span>
              </div>
              {paymentMethod === "wallet" ? (
                <Icon name="target" width={18} height={18} />
              ) : (
                <Icon name="unchecked" alt="unchecked" width={18} height={18} />
              )}
            </button>
          </div>

          <div className="bg-[#f4f5fc] px-4 py-5 lg:p-6 rounded-xl space-y-4 shadow-md mt-6">
            <h3 className="text-xl font-semibold">Card Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-2">
                  Card holder name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={cardDetails.cardholderName}
                  onChange={handleInputChange}
                  placeholder="eg: John Doe"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  placeholder="0000 1111 2222 3333"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-2">
                    Expiry date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    placeholder="09/10"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-auto pt-6">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="px-4 bg-[#758BFD] text-white py-3 rounded-lg font-medium hover:bg-[#91a2fd] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>

        <div className="flex flex-col bg-white px-4 py-5 md:px-8 md:py-10 rounded-lg order-first lg:order-last">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Order Summary</h2>
          </div>

          <div className="grid grid-cols-2 gap-y-12 gap-x-6 md:gap-x-8 font-semibold">
            <div>
              <span className="text-gray-500 block mb-1">Plan Name:</span>
              <span className="font-medium">{planName}</span>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">Billing Cycle:</span>
              <span className="font-medium">{billingCycle}</span>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">Start Date:</span>
              <span className="font-medium">{startDate}</span>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">
                Next Billing Date:
              </span>
              <span className="font-medium">{nextBillingDate}</span>
            </div>

            <div className="col-span-2">
              <span className="text-gray-500 block mb-1">Amount:</span>
              <span className="font-bold">{amount}</span>
            </div>
          </div>

          <div className="flex justify-end ml-auto mt-auto mb-2">
            <ChangePlan />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentLayout;
```

---

## 4. Success Page

**File:** `src/components/dashboard/thank-you/success.tsx`

```typescript
"use client";
import React from "react";

import LaunchDashboard from "../launch-dashboard";

export default function SuccessPage() {


  return (
    <LaunchDashboard title="Generate AR Links">
      <div className="p-2">
        <h2 className="text-xl font-bold">Payment</h2>
      </div>

    <p>Success</p>
    </LaunchDashboard>
  );
}
```

---

## 5. Failure Page

**File:** `src/components/dashboard/purchase-failed/failure.tsx`

```typescript
"use client";
import React from "react";

import LaunchDashboard from "../launch-dashboard";

export default function FailurePage() {


  return (
    <LaunchDashboard title="Generate AR Links">
      <div className="p-2">
        <h2 className="text-xl font-bold">Payment</h2>
      </div>

    <p>Failed</p>
    </LaunchDashboard>
  );
}
```

---

## Environment Variables

```bash
# Backend - Server-side only
STRIPE_SECRET_KEY=sk_test_51OpazCHw4aNq4gdL99oVUwGTkdiLzNhby0MvyxRNsnqQ7dPrnWgaxp7yktrkyU3qs0ccJcQWoAQCHQt03FYDcC2U00Z2UgN1sJ

# Frontend - Currently hardcoded in payment-layout.tsx
# Should be moved to environment variable:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51OpazCHw4aNq4gdLwqocQbL63yx3IiQHUtQAUvR8oKI9zD2wLStLgx64lUOnmZ2y7TCgwayOM2rlr6K1oKman9Ht00Ecl9KJP9
```

---

## NPM Dependencies

```json
{
  "dependencies": {
    "stripe": "^x.x.x",
    "@stripe/stripe-js": "^x.x.x"
  }
}
```

---

## Flow Overview

1. **User clicks "Proceed to Pay"** → `handlePayment()` is triggered
2. **Frontend calls API** → `POST /api/create-checkout-session`
3. **Backend creates Stripe session** → Returns `sessionId`
4. **Frontend redirects to Stripe** → `stripe.redirectToCheckout({ sessionId })`
5. **Payment completed** → Stripe redirects to:
   - Success: `/thank-you`
   - Cancel: `/purchase-failed`

---

## Security Notes

⚠️ **IMPORTANT:** The code currently has hardcoded test API keys. For production:
- Move all keys to environment variables
- Use production keys instead of test keys
- Never commit API keys to version control
- Add `.env` to `.gitignore`
