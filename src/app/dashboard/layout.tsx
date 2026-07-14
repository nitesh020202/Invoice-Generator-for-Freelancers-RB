import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, FileText, CreditCard } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { SignOutButton } from "@/components/sign-out-button";
import { brandGradientClass } from "@/lib/ui";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-white sm:h-8 sm:w-8 ${brandGradientClass}`}>
              <FileText className="h-4 w-4" strokeWidth={2.5} />
            </span>
            Invoicely
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {user.plan === "PRO" ? "Pro" : "Starter"}
            </span>
            <SignOutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-2 text-sm text-neutral-600 sm:px-4 dark:text-neutral-400">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
