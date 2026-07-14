import Link from "next/link";
import { Users, FileText, DollarSign, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { getMonthlyInvoiceUsage } from "@/lib/invoice-limit";
import { FREE_MONTHLY_INVOICE_LIMIT } from "@/lib/plans";
import { cardClass } from "@/lib/ui";

export default async function DashboardPage() {
  const user = await requireCurrentUser();

  const [clientCount, invoices, monthlyUsage] = await Promise.all([
    prisma.client.count({ where: { userId: user.id } }),
    prisma.invoice.findMany({
      where: { userId: user.id },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    getMonthlyInvoiceUsage(user.id),
  ]);

  const totalUnpaid = invoices
    .filter((inv) => inv.status === "UNPAID")
    .reduce(
      (sum, inv) => sum + inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
      0
    );

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Users className="h-5 w-5" />} label="Clients" value={clientCount} />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Invoices this month"
          value={
            user.plan === "FREE" ? `${monthlyUsage} / ${FREE_MONTHLY_INVOICE_LIMIT}` : monthlyUsage
          }
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Outstanding"
          value={`$${totalUnpaid.toFixed(2)}`}
        />
      </div>

      {user.plan === "FREE" && monthlyUsage >= FREE_MONTHLY_INVOICE_LIMIT && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          You&apos;ve used all {FREE_MONTHLY_INVOICE_LIMIT} free invoices this month.{" "}
          <Link href="/billing" className="font-medium underline">
            Upgrade to Pro
          </Link>{" "}
          for unlimited invoices.
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">Recent invoices</h2>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/invoices/new"
            className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            New invoice
          </Link>
          <Link
            href="/dashboard/invoices"
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className={`mt-4 ${cardClass}`}>
          <p className="text-sm text-neutral-500">
            No invoices yet.{" "}
            <Link href="/dashboard/invoices/new" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
              Create your first one
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
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
                    <p className="truncate text-sm text-neutral-500">{inv.client.name}</p>
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className={cardClass}>
      <div className="flex items-center gap-2 text-neutral-500">
        {icon}
        <p className="text-sm">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
