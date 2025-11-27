// src/feature/contracts/hooks/useContractSignature.ts
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { downloadContractSignatureAsBlob } from "../api/contracts";

export const useContractSignature = (
    propertyId: number,
    contractId: number | null,
    enabled: boolean
) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    // Query para obtener el Blob (este SÍ se cachea)
    const blobQuery = useQuery({
        queryKey: ["contracts", "signature", "blob", propertyId, contractId],
        enabled: enabled && !!contractId,
        queryFn: async () => {
            console.log("🔍 Fetching signature blob:", { propertyId, contractId });
            if (!contractId) throw new Error("Contract ID required");
            
            const blob = await downloadContractSignatureAsBlob(
                propertyId,
                contractId
            );
            console.log("✅ Blob received:", { size: blob.size, type: blob.type });
            
            if (blob.size === 0) {
                throw new Error("Empty blob received");
            }
            
            return blob;
        },
        staleTime: 1000 * 60 * 5, // Cachear blob por 5 minutos
        gcTime: 1000 * 60 * 10, // Mantener en memoria 10 minutos
        retry: 2,
        retryDelay: 1000,
    });

    // Crear y limpiar blob URL basado en el blob
    useEffect(() => {
        if (blobQuery.data) {
            // Limpiar URL anterior si existe
            if (blobUrl) {
                console.log("🧹 Revoking old blob URL:", blobUrl);
                URL.revokeObjectURL(blobUrl);
            }

            // Crear nueva URL
            const url = URL.createObjectURL(blobQuery.data);
            console.log("✅ Blob URL created:", url);
            setBlobUrl(url);

            // Cleanup al desmontar o cuando cambie el blob
            return () => {
                console.log("🧹 Cleanup: Revoking blob URL:", url);
                URL.revokeObjectURL(url);
            };
        } else {
            // Si no hay blob, limpiar la URL
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
                setBlobUrl(null);
            }
        }
    }, [blobQuery.data]);

    return {
        data: blobUrl,
        isLoading: blobQuery.isLoading,
        error: blobQuery.error,
        isError: blobQuery.isError,
    };
};
