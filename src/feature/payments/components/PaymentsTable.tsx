// src/feature/payments/components/PendingPaymentsTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { PaymentRecord } from "@/feature/payments/lib/paymentsStorage";

type PendingPaymentsTableProps = {
  payments: PaymentRecord[];
  onPay: (payment: PaymentRecord) => void;
};

export function PendingPaymentsTable({
  payments,
  onPay,
}: PendingPaymentsTableProps) {
  if (!payments.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay pagos pendientes para esta propiedad.
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
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.tenantName}</TableCell>
              <TableCell>{p.roomCode}</TableCell>
              <TableCell className="capitalize">{p.periodLabel}</TableCell>
              <TableCell>
                {p.dueDate.split("-").reverse().join("/")}
              </TableCell>
              <TableCell>S/ {p.amount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => onPay(p)}>
                  Realizar pago
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
