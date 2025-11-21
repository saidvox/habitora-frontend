// src/feature/payments/components/ConfirmPaymentDialog.tsx

import { useRef, useEffect, useState, type MouseEvent, type TouchEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  PaymentRecord,
  PaymentMethod,
} from "@/feature/payments/lib/paymentsStorage";
import { markPaymentAsPaid } from "@/feature/payments/lib/paymentsStorage";

type ConfirmPaymentDialogProps = {
  propertyId: number;
  payment: PaymentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (list: PaymentRecord[]) => void;
};

export function ConfirmPaymentDialog({
  propertyId,
  payment,
  open,
  onOpenChange,
  onUpdated,
}: ConfirmPaymentDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStroke, setHasStroke] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // reset al abrir
  useEffect(() => {
    if (!open) return;
    setMethod("");
    setHasStroke(false);
  }, [open]);

  // canvas
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const ratio = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = 200;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [open]);

  const getContext = () => canvasRef.current?.getContext("2d") ?? null;

  const getMousePos = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const getTouchPos = (e: TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const ctx = getContext();
    const pos = getMousePos(e);
    if (!ctx || !pos) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getContext();
    const pos = getMousePos(e);
    if (!ctx || !pos) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasStroke(true);
  };

  const stopDrawing = () => setIsDrawing(false);

  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = getContext();
    const pos = getTouchPos(e);
    if (!ctx || !pos) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = getContext();
    const pos = getTouchPos(e);
    if (!ctx || !pos) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasStroke(true);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    setHasStroke(false);
  };

  const handleConfirm = () => {
    if (!payment) return;
    if (!method) {
      toast.error("Selecciona un método de pago");
      return;
    }
    if (!hasStroke) {
      toast.error("Solicita la firma del inquilino antes de confirmar");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const updated = markPaymentAsPaid(propertyId, payment.id, method);
      toast.success("Pago confirmado correctamente");
      if (onUpdated) onUpdated(updated);
      handleClear();
      onOpenChange(false);
      setIsSaving(false);
    }, 500);
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Confirmar pago - {payment.tenantName}
          </DialogTitle>
          <DialogDescription>
            Registra el método de pago y la firma del inquilino para confirmar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumen superior */}
          <div className="rounded-xl border bg-muted/40 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Habitación</p>
              <p className="font-medium">{payment.roomCode}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mes</p>
              <p className="font-medium capitalize">
                {payment.periodLabel}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monto a pagar</p>
              <p className="font-semibold">S/ {payment.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="font-medium">
                {payment.dueDate.split("-").reverse().join("/")}
              </p>
            </div>
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Método de pago</p>
            <Select
              value={method}
              onValueChange={(v) => setMethod(v as PaymentMethod)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                <SelectItem value="YAPE">Yape</SelectItem>
                <SelectItem value="PLIN">Plin</SelectItem>
                <SelectItem value="TRANSFERENCIA">
                  Transferencia bancaria
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Firma */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Firma aquí</span>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:underline"
                onClick={handleClear}
                disabled={isSaving}
              >
                Limpiar
              </button>
            </div>
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50">
              <canvas
                ref={canvasRef}
                className="w-full h-[200px] touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Solicita al inquilino que firme dentro del recuadro.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isSaving}>
            {isSaving ? "Confirmando..." : "Confirmar pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
