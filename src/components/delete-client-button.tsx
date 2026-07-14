"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteClient } from "@/lib/actions";

export function DeleteClientButton({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this client and all their invoices?")) return;
        startTransition(async () => {
          await deleteClient(clientId);
          router.refresh();
        });
      }}
      aria-label="Delete client"
      className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
    >
      <Trash2 className="h-4 w-4" />
      <span className="hidden sm:inline">Delete</span>
    </button>
  );
}
