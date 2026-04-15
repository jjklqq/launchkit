import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
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
        </div>

        <h1 className="text-xl font-bold tracking-tight">Payment successful</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for your purchase. Your plan is now active.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
