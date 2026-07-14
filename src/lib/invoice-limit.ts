import { prisma } from "@/lib/prisma";
import { FREE_MONTHLY_INVOICE_LIMIT } from "@/lib/plans";
import type { Plan } from "@/generated/prisma/enums";

function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getMonthlyInvoiceUsage(userId: string) {
  return prisma.invoice.count({
    where: { userId, createdAt: { gte: startOfMonth() } },
  });
}

export async function canCreateInvoice(userId: string, plan: Plan) {
  if (plan === "PRO") return { allowed: true as const };

  const used = await getMonthlyInvoiceUsage(userId);
  if (used >= FREE_MONTHLY_INVOICE_LIMIT) {
    return {
      allowed: false as const,
      reason: `You've hit the Starter plan limit of ${FREE_MONTHLY_INVOICE_LIMIT} invoices this month. Upgrade to Pro for unlimited invoices.`,
    };
  }

  return { allowed: true as const };
}
