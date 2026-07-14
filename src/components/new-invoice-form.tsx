"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";
import { createInvoice } from "@/lib/actions";
import { inputClass, primaryButtonClass, cardClass } from "@/lib/ui";

type Item = { description: string; quantity: string; unitPrice: string };

const emptyItem: Item = { description: "", quantity: "1", unitPrice: "" };

export function NewInvoiceForm({
  clients,
}: {
  clients: { id: string; name: string }[];
}) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([{ ...emptyItem }]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  function updateItem(index: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);

    if (!clientId) {
      setError("Add a client first.");
      return;
    }

    setLoading(true);
    const result = await createInvoice({
      clientId,
      dueDate,
      notes,
      items: items.map((it) => ({
        description: it.description,
        quantity: parseFloat(it.quantity) || 0,
        unitPrice: parseFloat(it.unitPrice) || 0,
      })),
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  if (clients.length === 0) {
    return (
      <div className={cardClass}>
        <p className="text-sm text-neutral-500">
          You need a client before creating an invoice.{" "}
          <Link href="/dashboard/clients" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
            Add one first
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${cardClass} space-y-6`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Client</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className={`mt-1 w-full ${inputClass}`}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Due date</label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`mt-1 w-full ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Line items</label>
        <div className="mt-2 space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-2 rounded-lg border border-neutral-200 p-3 sm:grid-cols-12 sm:items-center sm:border-0 sm:p-0 dark:border-neutral-800"
            >
              <input
                placeholder="Description"
                required
                value={item.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                className={`col-span-2 sm:col-span-6 ${inputClass}`}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Qty"
                required
                value={item.quantity}
                onChange={(e) => updateItem(i, { quantity: e.target.value })}
                className={`sm:col-span-2 ${inputClass}`}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Unit price"
                required
                value={item.unitPrice}
                onChange={(e) => updateItem(i, { unitPrice: e.target.value })}
                className={`sm:col-span-3 ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                disabled={items.length === 1}
                aria-label="Remove line item"
                className="flex items-center justify-center gap-1.5 rounded-md py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-30 sm:col-span-1 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sm:hidden">Remove</span>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          <Plus className="h-4 w-4" />
          Add line item
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={`mt-1 w-full ${inputClass}`}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
        <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
        <div className="sm:text-right">
          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className={`w-full sm:w-auto ${primaryButtonClass}`}>
            {loading ? "Creating…" : "Create invoice"}
          </button>
        </div>
      </div>
    </form>
  );
}
