"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Stage = "verifying" | "ready" | "done" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("verifying");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase JS fires PASSWORD_RECOVERY when it detects the recovery token
    // in the URL hash after the user clicks the reset link in their email.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStage("ready");
      }
    });

    // Guard: if no recovery event fires within 5 s, the link is invalid/expired
    const timer = setTimeout(() => {
      setStage((s) => (s === "verifying" ? "invalid" : s));
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setStage("done");
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (stage === "verifying") {
    return (
      <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
        <p className="text-sm text-muted-foreground">Verifying reset link…</p>
      </div>
    );
  }

  if (stage === "invalid") {
    return (
      <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
        <h1 className="text-xl font-bold tracking-tight">Link expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
        <h1 className="text-xl font-bold tracking-tight">Password updated</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Redirecting you to the dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
