// src/feature/payments/components/PaymentsHistoryTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PaymentRecord } from "@/feature/payments/lib/paymentsStorage";

type PaymentsHistoryTableProps = {
  payments: PaymentRecord[];
};

export function PaymentsHistoryTable({ payments }: PaymentsHistoryTableProps) {
  if (!payments.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay pagos registrados para esta propiedad.
      </p>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Inquilino</TableHead>
            <TableHead>Habitación</TableHead>
            <TableHead>Mes</TableHead>
            <TableHead>Fecha de pago</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.tenantName}</TableCell>
              <TableCell>{p.roomCode}</TableCell>
              <TableCell className="capitalize">{p.periodLabel}</TableCell>
              <TableCell>
                {p.paymentDate
                  ? p.paymentDate.split("-").reverse().join("/")
                  : "—"}
              </TableCell>
              <TableCell>S/ {p.amount.toFixed(2)}</TableCell>
              <TableCell>
                {p.method || "—"}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    p.status === "PAGADO"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : ""
                  }
                >
                  {p.status === "PAGADO" ? "Pagado" : "Pendiente"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
