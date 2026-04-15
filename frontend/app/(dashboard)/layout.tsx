"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/billing",   label: "Billing"   },
  { href: "/settings",  label: "Settings"  },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-card px-3 py-6">
      <div className="mb-8 px-3">
        <span className="text-lg font-bold tracking-tight">LaunchKit</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="mt-4 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Sign out
      </button>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
