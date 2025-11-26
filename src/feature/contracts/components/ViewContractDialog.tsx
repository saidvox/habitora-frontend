// src/feature/contracts/components/ViewContractDialog.tsx

import {
    Calendar,
    CreditCard,
    FileText,
    Home,
    User,
    PenTool,
    Image as ImageIcon,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useContractById } from "../hooks/useContractById";
import { useContractSignature } from "../hooks/useContractSignature";

type ViewContractDialogProps = {
    propertyId: number;
    contractId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSign?: (contractId: number) => void;
};

export default function ViewContractDialog({
    propertyId,
    contractId,
    open,
    onOpenChange,
    onSign,
}: ViewContractDialogProps) {
    const { data: contract, isLoading, isError } = useContractById(
        propertyId,
        contractId
    );

    console.log("ViewContractDialog render:", { open, contractId, isLoading, isError, contract });

    const { data: signatureUrl, isLoading: isLoadingSignature } =
        useContractSignature(
            propertyId,
            contractId,
            !!contract?.tieneFirma && open
        );

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        // Asumimos que la fecha viene en formato YYYY-MM-DD
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return new Intl.DateTimeFormat("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const getStatusBadge = (estado?: string, tieneFirma?: boolean) => {
        if (!estado) return null;

        if (estado === "CANCELADO") {
            return (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    Cancelado
                </Badge>
            );
        }

        if (estado === "ACTIVO" && !tieneFirma) {
            return (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                    Activo (Pendiente de firma)
                </Badge>
            );
        }

        if (estado === "ACTIVO" && tieneFirma) {
            return (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                    Activo (Firmado)
                </Badge>
            );
        }

        return <Badge variant="outline">{estado}</Badge>;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Detalle del Contrato
                    </DialogTitle>
                    <DialogDescription>
                        Información completa del contrato de arrendamiento.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                        </div>
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                    </div>
                ) : isError || !contract ? (
                    <div className="py-8 text-center text-muted-foreground">
                        No se pudo cargar la información del contrato.
                    </div>
                ) : (
                    <div className="space-y-6 py-2">
                        {/* Header Status */}
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Estado del contrato
                                </p>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(contract.estado, contract.tieneFirma)}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Código
                                </p>
                                <p className="font-mono font-medium">#{contract.id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Inquilino */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <User className="w-4 h-4" />
                                    Inquilino
                                </div>
                                <div className="bg-white border rounded-lg p-3 space-y-2 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Nombre Completo</p>
                                        <p className="font-medium">{contract.inquilinoNombre}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-muted-foreground text-xs">DNI / Documento</p>
                                            <p>{contract.inquilinoDni}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Teléfono</p>
                                            <p>{contract.inquilinoTelefono || "-"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">Email</p>
                                        <p>{contract.inquilinoEmail || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Habitación */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <Home className="w-4 h-4" />
                                    Habitación
                                </div>
                                <div className="bg-white border rounded-lg p-3 space-y-2 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Habitación</p>
                                        <p className="font-medium">{contract.habitacionCodigo}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-muted-foreground text-xs">Precio Renta</p>
                                            <p>S/ {Number(contract.habitacionPrecioRenta).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Estado Actual</p>
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {contract.habitacionEstado}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Detalles del Contrato */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <Calendar className="w-4 h-4" />
                                    Vigencia
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Fecha Inicio</p>
                                        <p className="font-medium">{formatDate(contract.fechaInicio)}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">Fecha Fin</p>
                                        <p className="font-medium">{formatDate(contract.fechaFin)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <CreditCard className="w-4 h-4" />
                                    Pagos
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Depósito de Garantía</p>
                                        <p className="font-medium">S/ {contract.montoDeposito.toFixed(2)}</p>
                                    </div>
                                    {/* Aquí se podrían agregar más detalles financieros si existieran */}
                                </div>
                            </div>
                        </div>

                        {/* Firma */}
                        {contract.tieneFirma && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                        <ImageIcon className="w-4 h-4" />
                                        Firma del Inquilino
                                    </div>
                                    <div className="bg-slate-50 border rounded-lg p-4 flex justify-center items-center min-h-[120px]">
                                        {isLoadingSignature ? (
                                            <Skeleton className="h-24 w-48" />
                                        ) : signatureUrl ? (
                                            <img
                                                src={signatureUrl}
                                                alt="Firma del inquilino"
                                                className="max-h-32 object-contain"
                                            />
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No se pudo cargar la firma.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>

                    {contract &&
                        contract.estado === "ACTIVO" &&
                        !contract.tieneFirma &&
                        onSign && (
                            <Button onClick={() => onSign(contract.id)} className="gap-2">
                                <PenTool className="w-4 h-4" />
                                Firmar Contrato
                            </Button>
                        )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
