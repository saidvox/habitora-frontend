// src/feature/payments/pages/PaymentsPage.tsx
import { useState, useMemo } from "react";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { useFacturas } from "../hooks/useFacturas";
import { FacturasTable } from "../components/FacturasTable";
import { RegistrarPagoDialog } from "../components/RegistrarPagoDialog";
import Spinner from "@/components/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Factura, EstadoFactura } from "../types";
import { AlertCircle, CheckCircle2, Clock, Users } from "lucide-react";

export const PaymentsPage = () => {
  const currentPropertyId = useCurrentPropertyStore((s) => s.currentPropertyId);
  const [filtroEstado, setFiltroEstado] = useState<EstadoFactura | undefined>(undefined);
  const [filtroInquilino, setFiltroInquilino] = useState<string>("todos");
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: facturas, isLoading, isError } = useFacturas(currentPropertyId, undefined, filtroEstado);

  const handleRegistrarPago = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFacturaSeleccionada(null);
  };

  // Filtrar facturas canceladas
  const facturasActivas = facturas?.filter((f) => f.estado !== "CANCELADA") || [];

  // Obtener lista única de inquilinos
  const inquilinos = useMemo(() => {
    const uniqueInquilinos = new Map<string, string>();
    facturasActivas.forEach((f) => {
      if (!uniqueInquilinos.has(f.inquilinoNombre)) {
        uniqueInquilinos.set(f.inquilinoNombre, f.inquilinoNombre);
      }
    });
    return Array.from(uniqueInquilinos.values()).sort();
  }, [facturasActivas]);

  // Aplicar filtro de inquilino
  const facturasFiltradas = useMemo(() => {
    if (filtroInquilino === "todos") return facturasActivas;
    return facturasActivas.filter((f) => f.inquilinoNombre === filtroInquilino);
  }, [facturasActivas, filtroInquilino]);

  // Estadísticas (basadas en las facturas filtradas)
  const facturasPendientes = facturasFiltradas.filter((f) => !f.esPagada);
  const facturasVencidas = facturasFiltradas.filter((f) => f.esVencida && !f.esPagada);
  const facturasPagadas = facturasFiltradas.filter((f) => f.esPagada);
  const totalPendiente = facturasPendientes.reduce((sum, f) => sum + f.montoRenta, 0);

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">Error al cargar las facturas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las facturas y pagos de alquiler
          </p>
        </div>

        {/* Filtro por inquilino */}
        {inquilinos.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Select value={filtroInquilino} onValueChange={setFiltroInquilino}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Filtrar por inquilino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los inquilinos</SelectItem>
                {inquilinos.map((inquilino) => (
                  <SelectItem key={inquilino} value={inquilino}>
                    {inquilino}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h3 className="text-sm font-medium text-muted-foreground">Pendientes</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{facturasPendientes.length}</p>
          <p className="text-sm text-muted-foreground">{formatMonto(totalPendiente)}</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-medium text-muted-foreground">Vencidas</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{facturasVencidas.length}</p>
          <p className="text-sm text-muted-foreground">
            {formatMonto(facturasVencidas.reduce((sum, f) => sum + f.montoRenta, 0))}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="text-sm font-medium text-muted-foreground">Pagadas</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{facturasPagadas.length}</p>
          <p className="text-sm text-muted-foreground">
            {formatMonto(facturasPagadas.reduce((sum, f) => sum + f.montoRenta, 0))}
          </p>
        </div>
      </div>

      {/* Tabla con filtros */}
      <Tabs defaultValue="todas" onValueChange={(v) => {
        if (v === "todas") setFiltroEstado(undefined);
        else if (v === "pendientes") setFiltroEstado("ABIERTA");
        else if (v === "vencidas") setFiltroEstado("VENCIDA");
        else if (v === "pagadas") setFiltroEstado("PAGADA");
      }}>
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendientes">
            Pendientes ({facturasPendientes.length})
          </TabsTrigger>
          <TabsTrigger value="vencidas">
            Vencidas ({facturasVencidas.length})
          </TabsTrigger>
          <TabsTrigger value="pagadas">
            Pagadas ({facturasPagadas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-4">
          <FacturasTable facturas={facturasFiltradas} onRegistrarPago={handleRegistrarPago} />
        </TabsContent>
        <TabsContent value="pendientes" className="mt-4">
          <FacturasTable facturas={facturasPendientes} onRegistrarPago={handleRegistrarPago} />
        </TabsContent>
        <TabsContent value="vencidas" className="mt-4">
          <FacturasTable facturas={facturasVencidas} onRegistrarPago={handleRegistrarPago} />
        </TabsContent>
        <TabsContent value="pagadas" className="mt-4">
          <FacturasTable facturas={facturasPagadas} onRegistrarPago={handleRegistrarPago} />
        </TabsContent>
      </Tabs>

      {/* Dialog de registro de pago */}
      <RegistrarPagoDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        factura={facturaSeleccionada}
        propiedadId={currentPropertyId!}
      />
    </div>
  );
};
