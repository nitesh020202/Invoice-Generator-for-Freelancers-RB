import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { NewClientForm } from "@/components/new-client-form";
import { DeleteClientButton } from "@/components/delete-client-button";
import { cardClass } from "@/lib/ui";

export default async function ClientsPage() {
  const user = await requireCurrentUser();
  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { invoices: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Clients</h1>

      <div className="mt-6">
        <NewClientForm />
      </div>

      {clients.length === 0 ? (
        <div className={`mt-6 ${cardClass}`}>
          <p className="text-sm text-neutral-500">No clients yet.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium">{client.name}</p>
                <p className="truncate text-sm text-neutral-500">
                  {client.email || "No email"} · {client._count.invoices} invoice
                  {client._count.invoices === 1 ? "" : "s"}
                </p>
              </div>
              <DeleteClientButton clientId={client.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
