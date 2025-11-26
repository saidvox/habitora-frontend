// src/feature/contracts/pages/ContractsPage.tsx

import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { useContractsByProperty } from "../hooks/useContractsByProperty";
import { useFinalizeContract } from "../hooks/useFinalizeContract";

import type { ContratoEstado } from "../types";
import { ContractsTable } from "../components/ContractsTable";
import { NewContractDialog } from "../components/NewContractDialog";
import { SignContractDialog } from "../components/SignContractDialog";
import ViewContractDialog from "../components/ViewContractDialog";


import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const parsePropertyId = (raw?: string | null): number | null => {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
};

export function ContractsPage() {
  const params = useParams();

  const routeId =
    (params.propertyId as string | undefined) ??
    (params.propiedadId as string | undefined);

  const routePropertyId = useMemo(() => parsePropertyId(routeId), [routeId]);
  const { currentPropertyId } = useCurrentPropertyStore();

  const propertyId = routePropertyId ?? currentPropertyId ?? null;

  const [statusFilter, setStatusFilter] = useState<ContratoEstado | undefined>();
  const [search, setSearch] = useState("");

  const [signContractId, setSignContractId] = useState<number | null>(null);
  const [viewContractId, setViewContractId] = useState<number | null>(null);

  if (!propertyId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Contratos</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          No se encontró una propiedad válida.
        </p>
      </div>
    );
  }

  const {
    data: contracts,
    isLoading,
    isError,
  } = useContractsByProperty(propertyId, {
    estado: statusFilter,
    search: search || undefined,
  });

  const {
    mutate: finalizeContract,
    isPending: isFinalizing,
    variables: finalizeVars,
  } = useFinalizeContract(propertyId, {
    onSuccess: () => toast.success("Contrato finalizado correctamente"),
    onError: () => toast.error("No se pudo finalizar el contrato"),
  });

  const finalizingId = isFinalizing ? finalizeVars?.contractId ?? null : null;

  const handleViewDetails = (contractId: number) => {
    console.log("Opening contract view for ID:", contractId);
    setViewContractId(contractId);
  };

  const handleSignContract = (contractId: number) => {
    setSignContractId(contractId);
  };

  const handleFinalizeContract = (contractId: number) => {
    finalizeContract({ contractId });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Contratos</h1>
        <p className="text-sm text-muted-foreground">Cargando contratos…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Contratos</h1>
        <p className="text-sm text-red-500">
          Ocurrió un error al cargar los contratos.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contratos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los contratos de esta propiedad.
          </p>
        </div>

        <NewContractDialog propertyId={propertyId} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex gap-3 flex-wrap">
          <Select
            value={statusFilter ?? "ALL"}
            onValueChange={(v) =>
              setStatusFilter(v === "ALL" ? undefined : (v as ContratoEstado))
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="ACTIVO">Activos</SelectItem>
              <SelectItem value="CANCELADO">Cancelados</SelectItem>
            </SelectContent>
          </Select>

          <Input
            className="w-[240px]"
            placeholder="Buscar por inquilino o habitación"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ContractsTable
        contracts={contracts ?? []}
        onViewDetails={handleViewDetails}
        onSign={handleSignContract}
        onFinalize={handleFinalizeContract}
        finalizingId={finalizingId}
      />

      <SignContractDialog
        propertyId={propertyId}
        contractId={signContractId}
        open={signContractId !== null}
        onOpenChange={(open) => !open && setSignContractId(null)}
      />

      <ViewContractDialog
        propertyId={propertyId}
        contractId={viewContractId}
        open={viewContractId !== null}
        onOpenChange={(open) => !open && setViewContractId(null)}
        onSign={(id) => {
          setViewContractId(null);
          setSignContractId(id);
        }}
      />
    </div>
  );
}

export default ContractsPage;
