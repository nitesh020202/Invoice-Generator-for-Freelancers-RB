"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCheckoutSession, cancelSubscription } from "@/lib/stripe-actions";
import { primaryButtonClass } from "@/lib/ui";

export function UpgradeButton({ autoTrigger }: { autoTrigger?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const result = await createCheckoutSession();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoTrigger) handleClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTrigger]);

  return (
    <div>
      <button onClick={handleClick} disabled={loading} className={primaryButtonClass}>
        {loading ? "Redirecting to Stripe…" : "Upgrade to Pro"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function CancelButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => {
          if (!confirm("Cancel your Pro subscription at the end of the billing period?")) return;
          startTransition(async () => {
            const result = await cancelSubscription();
            if (result?.error) {
              setError(result.error);
              return;
            }
            router.refresh();
          });
        }}
        className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950"
      >
        {isPending ? "Cancelling…" : "Cancel subscription"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
