"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { createClient } from "@/lib/actions";
import { inputClass, primaryButtonClass, cardClass } from "@/lib/ui";

export function NewClientForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await createClient({ name, email, address });
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setName("");
    setEmail("");
    setAddress("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={cardClass}>
      <h2 className="flex items-center gap-2 font-medium">
        <UserPlus className="h-4 w-4 text-violet-500" />
        Add a client
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className={`mt-4 ${primaryButtonClass}`}>
        {loading ? "Adding…" : "Add client"}
      </button>
    </form>
  );
}
