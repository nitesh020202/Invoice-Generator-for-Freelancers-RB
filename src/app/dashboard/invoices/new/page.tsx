import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { NewInvoiceForm } from "@/components/new-invoice-form";

export default async function NewInvoicePage() {
  const user = await requireCurrentUser();
  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">New invoice</h1>
      <div className="mt-6">
        <NewInvoiceForm clients={clients} />
      </div>
    </div>
  );
}
