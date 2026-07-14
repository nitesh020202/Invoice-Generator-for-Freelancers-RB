export const FREE_MONTHLY_INVOICE_LIMIT = 3;

export const PLAN_FEATURES = {
  FREE: {
    name: "Starter",
    price: 0,
    invoiceLimit: FREE_MONTHLY_INVOICE_LIMIT,
    features: [
      `${FREE_MONTHLY_INVOICE_LIMIT} invoices / month`,
      "Unlimited clients",
      "PDF invoice downloads",
      "Paid/unpaid tracking",
    ],
  },
  PRO: {
    name: "Pro",
    price: 15,
    invoiceLimit: null,
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "PDF invoice downloads",
      "Paid/unpaid tracking",
      "Priority support",
    ],
  },
} as const;
