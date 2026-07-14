"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { canCreateInvoice } from "@/lib/invoice-limit";

const clientSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(200),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function createClient(input: {
  name: string;
  email?: string;
  address?: string;
}) {
  const user = await requireCurrentUser();
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.client.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
    },
  });

  revalidatePath("/dashboard/clients");
  return { ok: true };
}

export async function deleteClient(clientId: string) {
  const user = await requireCurrentUser();
  await prisma.client.deleteMany({ where: { id: clientId, userId: user.id } });
  revalidatePath("/dashboard/clients");
}

const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required").max(300),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().nonnegative("Unit price can't be negative"),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Select a client"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  items: z.array(invoiceItemSchema).min(1, "Add at least one line item"),
});

export async function createInvoice(input: {
  clientId: string;
  dueDate: string;
  notes?: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}) {
  const user = await requireCurrentUser();

  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const gate = await canCreateInvoice(user.id, user.plan);
  if (!gate.allowed) {
    return { error: gate.reason };
  }

  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, userId: user.id },
  });
  if (!client) {
    return { error: "Client not found" };
  }

  const invoiceCount = await prisma.invoice.count({ where: { userId: user.id } });
  const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(4, "0")}`;

  const invoice = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: client.id,
      invoiceNumber,
      dueDate: new Date(parsed.data.dueDate),
      notes: parsed.data.notes || null,
      items: {
        create: parsed.data.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
  redirect(`/dashboard/invoices/${invoice.id}`);
}

export async function setInvoiceStatus(invoiceId: string, status: "PAID" | "UNPAID") {
  const user = await requireCurrentUser();
  await prisma.invoice.updateMany({
    where: { id: invoiceId, userId: user.id },
    data: { status },
  });
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}

export async function deleteInvoice(invoiceId: string) {
  const user = await requireCurrentUser();
  await prisma.invoice.deleteMany({ where: { id: invoiceId, userId: user.id } });
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
  redirect("/dashboard/invoices");
}
