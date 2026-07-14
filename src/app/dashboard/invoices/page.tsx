import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { primaryButtonClass, cardClass } from "@/lib/ui";

export default async function InvoicesPage() {
  const user = await requireCurrentUser();
  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Link href="/dashboard/invoices/new" className={primaryButtonClass}>
          New invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className={`mt-6 ${cardClass}`}>
          <p className="text-sm text-neutral-500">No invoices yet.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {invoices.map((inv) => {
            const total = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
            return (
              <li key={inv.id}>
                <Link
                  href={`/dashboard/invoices/${inv.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{inv.invoiceNumber}</p>
                    <p className="truncate text-sm text-neutral-500">
                      {inv.client.name} · due {new Date(inv.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                    <span className="font-medium">${total.toFixed(2)}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        inv.status === "PAID"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
