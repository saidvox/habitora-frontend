// src/feature/contracts/components/SignContractDialog.tsx

import {
  useRef,
  useEffect,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
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

import { useUploadContractSignature } from "../hooks/useUploadContractSignature";

type SignContractDialogProps = {
  propertyId: number;
  contractId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SignContractDialog({
  propertyId,
  contractId,
  open,
  onOpenChange,
}: SignContractDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStroke, setHasStroke] = useState(false);

  const { mutate: uploadSignature, isPending } = useUploadContractSignature(
    propertyId,
    {
      onSuccess: () => {
        toast.success("Firma guardada correctamente");
        handleClear();
        onOpenChange(false);
      },
      onError: () => {
        toast.error("No se pudo guardar la firma");
      },
    }
  );

  // Ajustar ancho del canvas al contenedor
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const ratio = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = 220; // alto fijo

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
        ctx.scale(ratio, ratio);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [open]);

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  };

  const getPosFromMouse = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getPosFromTouch = (e: TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const ctx = getContext();
    const pos = getPosFromMouse(e);
    if (!ctx || !pos) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getContext();
    const pos = getPosFromMouse(e);
    if (!ctx || !pos) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasStroke(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = getContext();
    const pos = getPosFromTouch(e);
    if (!ctx || !pos) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = getContext();
    const pos = getPosFromTouch(e);
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

  const handleSave = () => {
    if (!contractId) {
      toast.error("Contrato no válido");
      return;
    }
    if (!hasStroke) {
      toast.error("Dibuja la firma antes de guardar");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png"); // data:image/png;base64,...
    // El hook se encarga de llamar a:
    // POST /api/propiedades/{propertyId}/contratos/{contractId}/firma
    uploadSignature({ contractId, base64: dataUrl });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Firmar contrato</DialogTitle>
          <DialogDescription>
            Pide al inquilino que firme dentro del recuadro. La firma se
            guardará como imagen dentro del contrato.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50">
            <canvas
              ref={canvasRef}
              className="w-full h-[220px] touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Firma con el mouse o con el dedo (si estás en un dispositivo
            táctil).
          </p>
        </div>

        <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isPending}
            >
              Limpiar
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave} disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar firma"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
