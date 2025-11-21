// src/feature/contracts/components/ContractsTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContratoListado } from "../types";

type ContractsTableProps = {
  contracts: ContratoListado[];
  onViewDetails?: (contractId: number) => void;
  onSign?: (contractId: number) => void;
  onFinalize?: (contractId: number) => void;
  finalizingId?: number | null;
};

// Asegúrate de que ContratoListado tenga:  tieneFirma: boolean
const getStatusBadge = (estado: string, tieneFirma: boolean) => {
  if (estado === "CANCELADO") {
    return (
      <Badge className="bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-300">
        Cancelado
      </Badge>
    );
  }

  if (estado === "ACTIVO" && !tieneFirma) {
    return (
      <Badge className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200">
        Activo (sin firmar)
      </Badge>
    );
  }

  if (estado === "ACTIVO" && tieneFirma) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300">
        Activo (firmado)
      </Badge>
    );
  }

  return <Badge variant="outline">{estado}</Badge>;
};

export function ContractsTable({
  contracts,
  onViewDetails,
  onSign,
  onFinalize,
  finalizingId,
}: ContractsTableProps) {
  if (!contracts.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay contratos registrados para esta propiedad.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900/60">
            <TableHead>Estado</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Habitación</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>Depósito (S/)</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {contracts.map((c) => {
            const canSign = c.estado === "ACTIVO" && !c.tieneFirma;
            const isFinalizing = finalizingId === c.id;

            return (
              <TableRow key={c.id}>
                <TableCell>{getStatusBadge(c.estado, c.tieneFirma)}</TableCell>
                <TableCell>{c.inquilinoNombre}</TableCell>
                <TableCell>{c.inquilinoDni}</TableCell>
                <TableCell>{c.habitacionCodigo}</TableCell>
                <TableCell>{c.fechaInicio}</TableCell>
                <TableCell>{c.fechaFin}</TableCell>
                <TableCell>{c.montoDeposito.toFixed(2)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails?.(c.id)}
                  >
                    Ver
                  </Button>

                  {canSign && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSign?.(c.id)}
                    >
                      Firmar
                    </Button>
                  )}

                  {c.estado === "ACTIVO" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onFinalize?.(c.id)}
                      disabled={isFinalizing}
                    >
                      {isFinalizing ? "Finalizando..." : "Finalizar"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
