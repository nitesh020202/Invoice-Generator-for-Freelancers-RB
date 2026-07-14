import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { InvoiceActions } from "@/components/invoice-actions";
import { brandGradientClass } from "@/lib/ui";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireCurrentUser();

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
    include: { client: true, items: true },
  });

  if (!invoice) notFound();

  const total = invoice.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Billed to {invoice.client.name} · due {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            invoice.status === "PAID"
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
          }`}
        >
          {invoice.status}
        </span>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500 dark:bg-neutral-900">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium">Description</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">Qty</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium">Unit price</th>
                <th className="whitespace-nowrap px-4 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="whitespace-nowrap px-4 py-2">{item.quantity}</td>
                  <td className="whitespace-nowrap px-4 py-2">${item.unitPrice.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-right">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
        </div>
      </div>

      {invoice.notes && (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-medium">Notes:</span> {invoice.notes}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`/api/invoices/${invoice.id}/pdf`}
          className={`flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-500/20 transition hover:shadow-violet-500/35 ${brandGradientClass}`}
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>
        <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
      </div>
    </div>
  );
}
