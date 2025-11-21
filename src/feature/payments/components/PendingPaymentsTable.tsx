// src/feature/payments/components/PaymentHistoryTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

type HistoryPaymentRow = {
  id: string;
  contractId: number;
  tenantName: string;
  roomCode: string;
  dueDate: string; // fecha original de vencimiento
  amount: number;
  paidAt?: string | null; // fecha de pago real
};

type PaymentHistoryTableProps = {
  payments: HistoryPaymentRow[];
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    const parts = dateStr.split("T")[0]?.split("-") ?? [];
    if (parts.length === 3) {
      const [y, m, d2] = parts;
      return `${d2}/${m}/${y}`;
    }
    return dateStr;
  }
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  if (!payments.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay pagos registrados en esta propiedad.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900/60">
            <TableHead>Inquilino</TableHead>
            <TableHead>Habitación</TableHead>
            <TableHead>Contrato</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Pagado el</TableHead>
            <TableHead>Monto (S/)</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.tenantName}</TableCell>
              <TableCell>{p.roomCode}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  #{p.contractId}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(p.dueDate)}</TableCell>
              <TableCell>{formatDate(p.paidAt)}</TableCell>
              <TableCell>{p.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Pagado
                  </span>
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
