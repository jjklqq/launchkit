"use client";

import { useState } from "react";
import { redirectToCheckout, type Plan } from "@/lib/stripe";

const PLANS: { id: Plan; name: string; price: number; features: string[] }[] =
  [
    {
      id: "starter",
      name: "Starter",
      price: 59,
      features: [
        "1 project",
        "5 GB storage",
        "Community support",
        "All core features",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 99,
      features: [
        "5 projects",
        "20 GB storage",
        "Priority email support",
        "Advanced analytics",
      ],
    },
    {
      id: "team",
      name: "Team",
      price: 149,
      features: [
        "Unlimited projects",
        "100 GB storage",
        "Dedicated support",
        "Team collaboration",
      ],
    },
  ];

export default function BillingPage() {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy(plan: Plan) {
    setError(null);
    setLoading(plan);
    try {
      await redirectToCheckout(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(null);
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One-time purchase — no subscription, no hidden fees.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col rounded-lg border bg-card p-6"
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-sm text-muted-foreground">one-time</span>
            </div>

            <ul className="mt-4 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <svg
                    className="h-4 w-4 shrink-0 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy(plan.id)}
              disabled={loading !== null}
              className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading === plan.id ? "Redirecting…" : "Buy"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
