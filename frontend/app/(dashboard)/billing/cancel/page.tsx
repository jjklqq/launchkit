import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <svg
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold tracking-tight">Payment cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No charge was made. You can return to billing whenever you&apos;re
          ready.
        </p>

        <Link
          href="/billing"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Back to billing
        </Link>
      </div>
    </main>
  );
}
