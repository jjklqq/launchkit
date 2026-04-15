"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Sign out
        </button>
      </div>

      {user && (
        <div className="mt-6 rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="mt-1 font-medium">{user.email}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {user.id}
          </p>
        </div>
      )}
    </main>
  );
}
