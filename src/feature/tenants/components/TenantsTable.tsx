// src/feature/tenants/components/TenantsTable.tsx

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useTenantsQuery } from "../hooks/queries/useTenantsQuery";
import type { Tenant } from "../types/tenants.types";

import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/EmptyState";

import {
  UserRound,
} from "lucide-react";
import { EditTenantDialog } from "./EditTenantsDialog";
import { DeleteTenantDialog } from "./DeleteTenantsDialog";

const PAGE_SIZE = 10;

function initials(name: string) {
  const p = name.trim().split(" ");
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[1][0]).toUpperCase();
}

export function TenantsTable({ propiedadId }: { propiedadId: number }) {
  const { data, isLoading, isError } = useTenantsQuery(propiedadId);
  const tenants: Tenant[] = data ?? [];

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [tenants.length]);

  if (isLoading) {
    return (
      <div className="space-y-2 mt-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive mt-4">
        Error al cargar inquilinos.
      </p>
    );
  }

  if (tenants.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No hay inquilinos"
        description="Registra inquilinos para gestionar contratos."
        compact
      />
    );
  }

  const totalPages = Math.ceil(tenants.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);

  const list = tenants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="border rounded-xl mt-6 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="flex items-center gap-1">
                <UserRound className="w-4 h-4 text-muted-foreground" />
                Inquilino
              </span>
            </TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead className="text-center">Contratos</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {list.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      {initials(t.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{t.nombreCompleto}</span>
                </div>
              </TableCell>

              <TableCell>{t.numeroDni}</TableCell>
              <TableCell className="truncate max-w-[220px]">{t.email}</TableCell>
              <TableCell>{t.telefonoWhatsapp}</TableCell>

              <TableCell className="text-center">{t.cantidadContratos}</TableCell>

              <TableCell className="text-right flex justify-end gap-1">
                <EditTenantDialog propiedadId={propiedadId} tenant={t} />
                <DeleteTenantDialog
                  propiedadId={propiedadId}
                  tenantId={t.id}
                  tenantName={t.nombreCompleto}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* footer paginación */}
      <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
        <span>
          Página {currentPage} de {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            className="text-sm px-2 py-1 border rounded-md"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <button
            className="text-sm px-2 py-1 border rounded-md"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
