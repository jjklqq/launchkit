import { supabase } from "@/lib/supabase";

export type Plan = "starter" | "pro" | "team";

export async function redirectToCheckout(plan: Plan): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You must be signed in to purchase a plan.");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/billing/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ plan }),
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? "Failed to create checkout session.");
  }

  const { url } = await res.json();
  window.location.href = url;
}
