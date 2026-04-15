import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "Authentication",
    description:
      "Email/password auth powered by Supabase. JWT verification, protected routes, and password reset — wired up from day one.",
    icon: "🔐",
  },
  {
    title: "Payments",
    description:
      "Stripe one-time checkout sessions with webhook handling. Three plans, idempotent purchase records, no subscriptions to wrangle.",
    icon: "💳",
  },
  {
    title: "Database",
    description:
      "PostgreSQL via Supabase with async SQLAlchemy. ORM models, typed schemas, and auto-migrating tables on startup.",
    icon: "🗄️",
  },
  {
    title: "Transactional Email",
    description:
      "Welcome emails and password-reset flows via Resend. Clean HTML templates, async delivery, and silent failure handling.",
    icon: "✉️",
  },
  {
    title: "Deploy-ready",
    description:
      "Dockerfile, railway.toml, and vercel.json included. Push to Railway + Vercel and you're live — no config hunting.",
    icon: "🚀",
  },
  {
    title: "Dashboard",
    description:
      "Protected dashboard with sidebar navigation, billing page, account settings, and a foundation for everything else.",
    icon: "🖥️",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: 59,
    checkoutUrl: "https://launchkitdev.lemonsqueezy.com/checkout/buy/64e7627f-0f82-44df-bf38-b9db61836376",
    features: ["1 project", "5 GB storage", "Community support", "All core features"],
  },
  {
    name: "Pro",
    price: 99,
    highlight: true,
    checkoutUrl: "https://launchkitdev.lemonsqueezy.com/checkout/buy/10c771b8-c378-45b8-8ea1-6b84451a0c32",
    features: ["5 projects", "20 GB storage", "Priority email support", "Advanced analytics"],
  },
  {
    name: "Team",
    price: 149,
    checkoutUrl: "https://launchkitdev.lemonsqueezy.com/checkout/buy/3135354e-b21f-4a81-a85e-d0c89c33237f",
    features: ["Unlimited projects", "100 GB storage", "Dedicated support", "Team collaboration"],
  },
];

const STACK = [
  { name: "Next.js 14",  desc: "App Router, server + client components" },
  { name: "FastAPI",     desc: "Async Python API with auto-generated docs" },
  { name: "Supabase",    desc: "Postgres database + Auth" },
  { name: "Stripe",      desc: "One-time payment sessions + webhooks" },
  { name: "Resend",      desc: "Transactional email API" },
  { name: "Railway",     desc: "Backend hosting with Docker" },
  { name: "Vercel",      desc: "Frontend hosting with edge CDN" },
  { name: "Tailwind CSS", desc: "Utility-first styling" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      {/* Nav */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="text-base font-bold tracking-tight">LaunchKit</span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <a
              href="https://launchkitdev.lemonsqueezy.com/checkout/buy/10c771b8-c378-45b8-8ea1-6b84451a0c32"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-24 text-center">
          <div className="inline-block rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Next.js 14 · FastAPI · Supabase · Stripe
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Ship your SaaS in{" "}
            <span className="text-primary">days</span>, not weeks
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            LaunchKit is a full-stack SaaS boilerplate with auth, payments,
            transactional email, and deployment configs — all wired together so
            you can focus on what makes your product unique.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
            >
              Start building →
            </Link>
            <a
              href="#pricing"
              className="rounded-md border px-6 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              See pricing
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Every piece is production-ready and integrated. No half-finished
              code, no placeholder TODOs.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border bg-card p-6 shadow-sm"
                >
                  <div className="mb-3 text-2xl">{f.icon}</div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Simple, one-time pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Pay once, own it forever. No subscriptions, no seat fees.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-xl border p-8 shadow-sm ${
                    plan.highlight
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary bg-background px-3 py-0.5 text-xs font-semibold text-primary">
                      Most popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span
                      className={`text-sm ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      one-time
                    </span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <svg
                          className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-primary-foreground" : "text-green-500"}`}
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
                  <a
                    href={plan.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 block rounded-md px-4 py-2 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
                      plan.highlight
                        ? "bg-background text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    Buy {plan.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Built on tools you already know
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Best-in-class libraries and platforms — opinionated choices that
              work great together.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STACK.map((s) => (
                <div
                  key={s.name}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to ship?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Stop reinventing auth, payments, and email setup. Clone LaunchKit,
              fill in your API keys, and start building the thing that matters.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
              >
                Get started free
              </Link>
              <a
                href="#pricing"
                className="rounded-md border px-8 py-3 text-sm font-semibold hover:bg-muted"
              >
                View pricing
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LaunchKit. Built for makers who ship.
        </div>
      </footer>

    </div>
  );
}
