"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null);

  // Password change state
  const [password, setPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    setPwLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setPwError(error.message);
    } else {
      setPwSuccess(true);
      setPassword("");
    }
    setPwLoading(false);
  }

  return (
    <main className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences.
        </p>
      </div>

      {/* ── Account info ──────────────────────────────────────── */}
      <section className="rounded-lg border bg-card p-6">
        <h2 className="text-base font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account details.
        </p>
        <div className="mt-4 flex items-center gap-3 rounded-md border bg-muted/40 px-4 py-3">
          <span className="text-sm text-muted-foreground">Email</span>
          <span className="ml-auto font-mono text-sm">{email ?? "—"}</span>
        </div>
      </section>

      {/* ── Change password ───────────────────────────────────── */}
      <section className="rounded-lg border bg-card p-6">
        <h2 className="text-base font-semibold">Change password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your password. Must be at least 8 characters.
        </p>

        <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />

          {pwError && <p className="text-sm text-destructive">{pwError}</p>}
          {pwSuccess && (
            <p className="text-sm text-green-600">Password updated.</p>
          )}

          <button
            type="submit"
            disabled={pwLoading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pwLoading ? "Saving…" : "Update password"}
          </button>
        </form>
      </section>

      {/* ── Danger zone ───────────────────────────────────────── */}
      <section className="rounded-lg border border-destructive/40 bg-card p-6">
        <h2 className="text-base font-semibold text-destructive">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          disabled
          className="mt-4 cursor-not-allowed rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive opacity-40"
          title="Account deletion is not yet available"
        >
          Delete account
        </button>
      </section>
    </main>
  );
}
