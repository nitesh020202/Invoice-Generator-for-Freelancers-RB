import Link from "next/link";
import { FileText, Users, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { PLAN_FEATURES } from "@/lib/plans";
import { brandGradientClass, brandGradientTextClass } from "@/lib/ui";

export default function LandingPage() {
  return (
    <main className="flex-1 overflow-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${brandGradientClass}`}>
            <FileText className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          Invoicely
        </span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-neutral-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Sign up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
        <div
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-3xl ${brandGradientClass}`}
        />
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          Built for freelancers, not enterprises
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
          Invoicing that actually
          <br />
          <span className={brandGradientTextClass}>gets you paid.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Invoicely is invoicing built for freelancers: add clients, generate
          polished PDF invoices in seconds, and track exactly who&apos;s paid
          and who&apos;s not.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className={`group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 ${brandGradientClass}`}
          >
            Start free — no card required
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <Feature
            icon={<Users className="h-5 w-5" />}
            title="Client management"
            body="Keep every client's contact details in one place, tied to your account."
          />
          <Feature
            icon={<FileText className="h-5 w-5" />}
            title="Real PDF invoices"
            body="Generate a polished, downloadable PDF invoice for any client in seconds."
          />
          <Feature
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Paid / unpaid tracking"
            body="See at a glance which invoices are outstanding and which are settled."
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Simple pricing</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Start free. Upgrade when you outgrow it.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <PricingCard
            name={PLAN_FEATURES.FREE.name}
            price={PLAN_FEATURES.FREE.price}
            features={PLAN_FEATURES.FREE.features}
            cta="Start free"
            href="/signup"
          />
          <PricingCard
            name={PLAN_FEATURES.PRO.name}
            price={PLAN_FEATURES.PRO.price}
            features={PLAN_FEATURES.PRO.features}
            cta="Go Pro"
            href="/signup?plan=pro"
            highlighted
          />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-neutral-500">
        Invoicely — built for the Zero to Subscriber hackathon.
      </footer>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="group rounded-xl border border-neutral-200 p-6 transition hover:border-violet-300 hover:shadow-md dark:border-neutral-800 dark:hover:border-violet-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
        {icon}
      </div>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{body}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  features,
  cta,
  href,
  highlighted,
}: {
  name: string;
  price: number;
  features: readonly string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-8 transition ${
        highlighted
          ? "border-transparent bg-neutral-900 text-white shadow-xl shadow-violet-500/10 dark:bg-neutral-50 dark:text-neutral-900"
          : "border-neutral-200 hover:shadow-md dark:border-neutral-800"
      }`}
    >
      {highlighted && (
        <span className={`absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${brandGradientClass}`}>
          Most popular
        </span>
      )}
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="mt-2">
        <span className="text-4xl font-semibold">${price}</span>
        <span className={highlighted ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-500"}>
          /month
        </span>
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckCircle2
              aria-hidden
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                highlighted ? "text-violet-400 dark:text-violet-600" : "text-violet-500"
              }`}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-8 block rounded-full px-4 py-2.5 text-center text-sm font-medium transition ${
          highlighted
            ? "bg-white text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700"
            : "border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
