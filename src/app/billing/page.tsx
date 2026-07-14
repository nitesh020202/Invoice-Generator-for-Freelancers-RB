import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { SignOutButton } from "@/components/sign-out-button";
import { UpgradeButton, CancelButton } from "@/components/billing-buttons";
import { PLAN_FEATURES } from "@/lib/plans";
import { cardClass, brandGradientClass } from "@/lib/ui";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; checkout?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { intent, checkout } = await searchParams;
  const isPro = user.plan === "PRO";
  const isCanceling = user.subscriptionStatus === "canceling";

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-white sm:h-8 sm:w-8 ${brandGradientClass}`}>
              <FileText className="h-4 w-4" strokeWidth={2.5} />
            </span>
            Invoicely
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-semibold">Billing</h1>

        {checkout === "success" && (
          <p className="mt-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            Payment received — your account has been upgraded.
          </p>
        )}
        {checkout === "cancelled" && (
          <p className="mt-4 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
            Checkout cancelled — no changes were made.
          </p>
        )}

        <div className={`mt-6 ${cardClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-neutral-500">Current plan</p>
              <p className="mt-1 text-xl font-semibold">
                {isPro ? PLAN_FEATURES.PRO.name : PLAN_FEATURES.FREE.name}
              </p>
            </div>
            {isPro && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {isCanceling ? "Cancels at period end" : "Active"}
              </span>
            )}
          </div>

          {isPro && user.currentPeriodEnd && (
            <p className="mt-3 text-sm text-neutral-500">
              {isCanceling ? "Access ends" : "Renews"} on{" "}
              {new Date(user.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}

          <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            {(isPro ? PLAN_FEATURES.PRO.features : PLAN_FEATURES.FREE.features).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {!isPro && <UpgradeButton autoTrigger={intent === "upgrade"} />}
            {isPro && !isCanceling && <CancelButton />}
            {isPro && isCanceling && (
              <p className="text-sm text-neutral-500">
                Your subscription is set to cancel. You&apos;ll keep Pro access until the date above.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
