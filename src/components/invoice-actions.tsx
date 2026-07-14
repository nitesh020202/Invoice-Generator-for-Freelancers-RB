"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { setInvoiceStatus, deleteInvoice } from "@/lib/actions";
import type { InvoiceStatus } from "@/generated/prisma/enums";
import { secondaryButtonClass } from "@/lib/ui";

export function InvoiceActions({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: InvoiceStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await setInvoiceStatus(invoiceId, status === "PAID" ? "UNPAID" : "PAID");
            router.refresh();
          })
        }
        className={secondaryButtonClass}
      >
        Mark as {status === "PAID" ? "unpaid" : "paid"}
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (!confirm("Delete this invoice?")) return;
          startTransition(() => deleteInvoice(invoiceId));
        }}
        aria-label="Delete invoice"
        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}
