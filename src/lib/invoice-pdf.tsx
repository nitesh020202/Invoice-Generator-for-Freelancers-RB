import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const BRAND = "#7c3aed";
const BRAND_DARK = "#5b21b6";
const INK = "#18181b";
const MUTED = "#71717a";
const BORDER = "#e4e4e7";
const ROW_ALT = "#faf9fb";

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 48,
    paddingHorizontal: 0,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK,
  },
  topBar: {
    height: 8,
    backgroundColor: BRAND,
  },
  body: {
    paddingHorizontal: 48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 32,
    marginBottom: 32,
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  brandMark: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: BRAND,
    marginRight: 8,
  },
  brandName: { fontSize: 14, fontWeight: 700, color: INK },
  title: { fontSize: 24, fontWeight: 700, color: INK, textAlign: "right" },
  invoiceNumber: { marginTop: 4, color: MUTED, fontSize: 10, textAlign: "right" },
  label: {
    color: MUTED,
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f7fb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 28,
  },
  cardCol: { flex: 1 },
  bodyText: { fontSize: 10.5, color: INK, lineHeight: 1.4 },
  statusBadgeWrap: { alignItems: "flex-end" },
  statusBadge: {
    fontSize: 9,
    fontWeight: 700,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statusPaid: { backgroundColor: "#dcfce7", color: "#15803d" },
  statusUnpaid: { backgroundColor: "#f4f4f5", color: "#52525b" },
  statusOverdue: { backgroundColor: "#fee2e2", color: "#b91c1c" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: BRAND_DARK,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottom: `1px solid ${BORDER}`,
  },
  tableRowAlt: { backgroundColor: ROW_ALT },
  colDescription: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colAmount: { flex: 1.5, textAlign: "right", fontWeight: 700 },
  totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
  totalsBox: { width: 220 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  totalsLabel: { fontSize: 10, color: MUTED },
  totalsValue: { fontSize: 10, color: INK },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: BRAND,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  grandTotalLabel: { fontSize: 11, fontWeight: 700, color: "#ffffff" },
  grandTotalValue: { fontSize: 12, fontWeight: 700, color: "#ffffff" },
  notes: {
    marginTop: 32,
    paddingTop: 16,
    borderTop: `1px solid ${BORDER}`,
  },
  notesText: { fontSize: 9.5, color: MUTED, lineHeight: 1.5, marginTop: 4 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 8.5,
    color: MUTED,
  },
});

export type InvoicePdfData = {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  currency: string;
  notes: string | null;
  issuedByName: string;
  client: { name: string; email: string | null; address: string | null };
  items: { description: string; quantity: number; unitPrice: number }[];
};

export function InvoicePdf({ invoice }: { invoice: InvoicePdfData }) {
  const total = invoice.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const isOverdue = invoice.status === "UNPAID" && invoice.dueDate.getTime() < Date.now();
  const statusLabel = isOverdue ? "Overdue" : invoice.status;
  const statusStyle = isOverdue
    ? styles.statusOverdue
    : invoice.status === "PAID"
      ? styles.statusPaid
      : styles.statusUnpaid;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />

        <View style={styles.body}>
          <View style={styles.header}>
            <View>
              <View style={styles.brandRow}>
                <View style={styles.brandMark} />
                <Text style={styles.brandName}>{invoice.issuedByName}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.title}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardCol}>
              <Text style={styles.label}>Bill to</Text>
              <Text style={[styles.bodyText, { fontWeight: 700 }]}>{invoice.client.name}</Text>
              {invoice.client.email && <Text style={styles.bodyText}>{invoice.client.email}</Text>}
              {invoice.client.address && <Text style={styles.bodyText}>{invoice.client.address}</Text>}
            </View>
            <View style={styles.cardCol}>
              <Text style={styles.label}>Issue date</Text>
              <Text style={styles.bodyText}>{invoice.issueDate.toLocaleDateString()}</Text>
              <Text style={[styles.label, { marginTop: 10 }]}>Due date</Text>
              <Text style={styles.bodyText}>{invoice.dueDate.toLocaleDateString()}</Text>
            </View>
            <View style={[styles.cardCol, styles.statusBadgeWrap]}>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.statusBadge, statusStyle]}>{statusLabel}</Text>
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.colDescription, styles.tableHeaderText]}>Description</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>Qty</Text>
            <Text style={[styles.colPrice, styles.tableHeaderText]}>Unit price</Text>
            <Text style={[styles.colAmount, styles.tableHeaderText]}>Amount</Text>
          </View>

          {invoice.items.map((item, i) => (
            <View
              style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowAlt] : [])]}
              key={i}
            >
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>
                {invoice.currency} {item.unitPrice.toFixed(2)}
              </Text>
              <Text style={styles.colAmount}>
                {invoice.currency} {(item.quantity * item.unitPrice).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.totalsWrap}>
            <View style={styles.totalsBox}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Subtotal</Text>
                <Text style={styles.totalsValue}>
                  {invoice.currency} {total.toFixed(2)}
                </Text>
              </View>
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total due</Text>
                <Text style={styles.grandTotalValue}>
                  {invoice.currency} {total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {invoice.notes && (
            <View style={styles.notes}>
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          Generated with Invoicely — thank you for your business.
        </Text>
      </Page>
    </Document>
  );
}
