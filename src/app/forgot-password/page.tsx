"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { inputClass, primaryButtonClass, brandGradientClass } from "@/lib/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-3xl ${brandGradientClass}`}
      />
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-none">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${brandGradientClass}`}>
            <FileText className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          Invoicely
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">Reset your password</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <p className="mt-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            If an account exists for {email}, a reset link is on its way. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 w-full ${inputClass}`}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className={`w-full ${primaryButtonClass}`}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-neutral-500">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
