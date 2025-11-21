// src/feature/contracts/components/NewContractDialog.tsx

import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateContract } from "../hooks/useCreateContract";
import { useAvailableRoomsByProperty } from "../hooks/useAvailableRoomsByProperty";
import { useTenantsByProperty } from "../hooks/useTenantsByProperty";

type NewContractDialogProps = {
  propertyId: number;
};

type RoomOption = {
  id: number;
  label: string;
  rent: number;
};

// Helper: suma meses a una fecha ISO (yyyy-mm-dd)
function addMonthsToISO(startISO: string, months: number): string {
  const [y, m, d] = startISO.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  date.setMonth(date.getMonth() + months);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper: 2025-11-21 -> 21/11/2025
function formatISOToHuman(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function NewContractDialog({ propertyId }: NewContractDialogProps) {
  const [open, setOpen] = useState(false);

  const [tenantId, setTenantId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [durationMonths, setDurationMonths] = useState<number>(6);

  // Inquilinos disponibles (sin contrato ACTIVO)
  const {
    data: tenants,
    isLoading: isLoadingTenants,
    isError: isErrorTenants,
  } = useTenantsByProperty(propertyId, { disponibles: true });

  // Habitaciones disponibles (estado = DISPONIBLE)
  const {
    data: roomsByFloor,
    isLoading: isLoadingRooms,
    isError: isErrorRooms,
  } = useAvailableRoomsByProperty(propertyId);

  // Aplanar SOLO habitaciones con precio > 0 para usarlas en el Select
  const roomOptions: RoomOption[] = useMemo(
    () =>
      roomsByFloor?.flatMap((floor) =>
        floor.habitaciones
          .filter((room) => Number(room.precioRenta || 0) > 0)
          .map((room) => {
            const rent = Number(room.precioRenta);
            return {
              id: room.id,
              rent,
              label: `Hab. ${room.codigo} — Piso ${
                floor.numeroPiso
              } — S/ ${rent.toFixed(2)}`,
            };
          })
      ) ?? [],
    [roomsByFloor]
  );

  const selectedRoom = roomOptions.find(
    (r) => String(r.id) === roomId.toString()
  );
  const monthlyRent = selectedRoom?.rent ?? 0;
  const depositAmount = monthlyRent; // aquí definimos que el depósito = 1 mes de renta

  const endDateISO =
    startDate && durationMonths ? addMonthsToISO(startDate, durationMonths) : "";
  const endDateHuman = endDateISO ? formatISOToHuman(endDateISO) : "";

  const { mutate: createContract, isPending } = useCreateContract(propertyId, {
    onSuccess: () => {
      toast.success("Contrato creado correctamente");
      setTenantId("");
      setRoomId("");
      setStartDate("");
      setDurationMonths(6);
      setOpen(false);
    },
    onError: () => {
      toast.error("No se pudo crear el contrato");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inquilinoId = Number(tenantId);
    const habitacionId = Number(roomId);

    if (!inquilinoId || !habitacionId) {
      toast.error("Inquilino y habitación son obligatorios");
      return;
    }

    if (!startDate) {
      toast.error("La fecha de inicio es obligatoria");
      return;
    }

    if (!durationMonths || durationMonths <= 0) {
      toast.error("Selecciona una duración válida");
      return;
    }

    if (!selectedRoom) {
      toast.error("Selecciona una habitación con precio válido");
      return;
    }

    const fechaFin = addMonthsToISO(startDate, durationMonths);
    const montoDeposito = depositAmount;

    createContract({
      inquilinoId,
      habitacionId,
      fechaInicio: startDate,
      fechaFin,
      montoDeposito,
    });
  };

  const isDisabled =
    isPending ||
    isLoadingRooms ||
    isLoadingTenants ||
    isErrorRooms ||
    isErrorTenants;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Crear contrato
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo contrato</DialogTitle>
          <DialogDescription>
            Completa los datos del contrato de arrendamiento para esta
            propiedad.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inquilino / Habitación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Inquilino */}
            <div className="space-y-2">
              <Label>Inquilino *</Label>
              <Select
                value={tenantId}
                onValueChange={setTenantId}
                disabled={isLoadingTenants || isErrorTenants || isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingTenants
                        ? "Cargando inquilinos..."
                        : isErrorTenants
                        ? "Error al cargar inquilinos"
                        : "Selecciona un inquilino"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {tenants && tenants.length > 0 ? (
                    tenants.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nombreCompleto} — {t.numeroDni}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No hay inquilinos disponibles sin contrato activo.
                    </div>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Solo se muestran inquilinos sin contrato activo.
              </p>
            </div>

            {/* Habitación */}
            <div className="space-y-2">
              <Label>Habitación *</Label>
              <Select
                value={roomId}
                onValueChange={setRoomId}
                disabled={isLoadingRooms || isErrorRooms || isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingRooms
                        ? "Cargando habitaciones..."
                        : isErrorRooms
                        ? "Error al cargar habitaciones"
                        : "Selecciona una habitación con precio"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {roomOptions.length > 0 ? (
                    roomOptions.map((room) => (
                      <SelectItem key={room.id} value={String(room.id)}>
                        {room.label}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No hay habitaciones disponibles con precio para contrato.
                    </div>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Solo se muestran habitaciones <strong>DISPONIBLES</strong> y con
                renta mayor a S/ 0.00.
              </p>
            </div>
          </div>

          {/* Fecha de inicio + duración */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Duración del contrato (meses) *</Label>
              <Select
                value={String(durationMonths)}
                onValueChange={(value) => setDurationMonths(Number(value))}
                disabled={isDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses (1 año)</SelectItem>
                  <SelectItem value="24">24 meses (2 años)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info fecha fin */}
          <div className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs">
              i
            </span>
            {startDate && endDateHuman ? (
              <span>
                El contrato finalizará el{" "}
                <span className="font-medium">{endDateHuman}</span>.
              </span>
            ) : (
              <span>
                Selecciona la fecha de inicio y la duración para calcular la
                fecha de fin.
              </span>
            )}
          </div>

          {/* Resumen financiero */}
          <div className="rounded-xl border bg-muted/40 px-4 py-3 space-y-2">
            <p className="text-sm font-medium">
              Resumen financiero del contrato
            </p>

            {selectedRoom ? (
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Renta mensual</span>
                  <span className="font-semibold">
                    S/ {monthlyRent.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Depósito requerido</span>
                  <span className="font-semibold">
                    S/ {depositAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  El depósito se registrará al crear el contrato.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Selecciona una habitación para ver el resumen financiero.
              </p>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isDisabled || !selectedRoom}>
              {isPending ? "Guardando..." : "Crear contrato"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
