// src/feature/payments/components/RegistrarPagoDialog.tsx
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PenTool, Trash2 } from "lucide-react";
import type { Factura, MetodoPago } from "../types";
import { useRegistrarPago } from "../hooks/useRegistrarPago";
import SignatureCanvas from "react-signature-canvas";

interface RegistrarPagoDialogProps {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
  propiedadId: number;
}

export function RegistrarPagoDialog({
  open,
  onClose,
  factura,
  propiedadId,
}: RegistrarPagoDialogProps) {
  const [fechaPago, setFechaPago] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [metodo, setMetodo] = useState<MetodoPago>("EFECTIVO");
  const signatureRef = useRef<SignatureCanvas>(null);

  const { mutate: registrarPago, isPending } = useRegistrarPago();

  const handleClearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSubmit = () => {
    if (!factura) return;

    // Validar que haya firma
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      alert("Por favor, firma el comprobante de pago");
      return;
    }

    // Obtener firma en base64
    const firmaBase64 = signatureRef.current.toDataURL();

    registrarPago(
      {
        propiedadId,
        facturaId: factura.id,
        request: {
          fechaPago,
          monto: factura.montoRenta,
          metodo,
          firmaBase64,
        },
      },
      {
        onSuccess: () => {
          onClose();
          // Reset form
          setFechaPago(new Date().toISOString().split("T")[0]);
          setMetodo("EFECTIVO");
          signatureRef.current?.clear();
        },
      }
    );
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);
  };

  if (!factura) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogDescription>
            Registra el pago completo de la factura
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info de la factura */}
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inquilino:</span>
              <span className="font-medium">{factura.inquilinoNombre}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Habitación:</span>
              <span className="font-medium">{factura.habitacionCodigo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monto:</span>
              <span className="font-semibold text-lg">
                {formatMonto(factura.montoRenta)}
              </span>
            </div>
          </div>

          {/* Fecha de pago */}
          <div className="space-y-2">
            <Label htmlFor="fechaPago">Fecha de pago *</Label>
            <Input
              id="fechaPago"
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label htmlFor="metodo">Método de pago *</Label>
            <Select value={metodo} onValueChange={(v) => setMetodo(v as MetodoPago)}>
              <SelectTrigger id="metodo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                <SelectItem value="YAPE">Yape</SelectItem>
                <SelectItem value="PLIN">Plin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Firma del inquilino */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                Firma del inquilino *
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSignature}
                className="h-8 gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Limpiar
              </Button>
            </div>
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-1">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: "w-full h-32 rounded bg-background cursor-crosshair",
                }}
                backgroundColor="transparent"
                penColor="currentColor"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Firma del inquilino confirmando la recepción del pago
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Registrando..." : "Registrar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
