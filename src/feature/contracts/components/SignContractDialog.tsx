// src/feature/contracts/components/SignContractDialog.tsx

import { useRef } from "react";
import { toast } from "sonner";
import SignatureCanvas from "react-signature-canvas";
import { PenTool, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
  const signatureRef = useRef<SignatureCanvas>(null);

  const { mutate: uploadSignature, isPending } = useUploadContractSignature(
    propertyId,
    {
      onSuccess: () => {
        toast.success("Firma guardada correctamente");
        signatureRef.current?.clear();
        onOpenChange(false);
      },
      onError: () => toast.error("No se pudo guardar la firma"),
    }
  );

  const handleClear = () => {
    signatureRef.current?.clear();
  };

  const handleSave = () => {
    if (!contractId) {
      return toast.error("Contrato no válido");
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      return toast.error("Dibuja la firma antes de guardar");
    }

    const dataUrl = signatureRef.current.toDataURL("image/png");
    uploadSignature({ contractId, base64: dataUrl });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Firmar contrato</DialogTitle>
          <DialogDescription>
            Pide al inquilino que firme dentro del recuadro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Firma del inquilino *
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={isPending}
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
                className: "w-full h-52 rounded bg-background cursor-crosshair",
              }}
              backgroundColor="transparent"
              penColor="currentColor"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Firma con mouse, trackpad o dedo en pantallas táctiles.
          </p>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar firma"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
