// src/feature/contracts/hooks/useContractSignature.ts
import { useQuery } from "@tanstack/react-query";
import { downloadContractSignatureAsBlob } from "../api/contracts";

export const useContractSignature = (
    propertyId: number,
    contractId: number | null,
    enabled: boolean
) => {
    return useQuery({
        queryKey: ["contracts", "signature", propertyId, contractId],
        enabled: enabled && !!contractId,
        queryFn: async () => {
            if (!contractId) throw new Error("Contract ID required");
            const blob = await downloadContractSignatureAsBlob(
                propertyId,
                contractId
            );
            return URL.createObjectURL(blob);
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};
