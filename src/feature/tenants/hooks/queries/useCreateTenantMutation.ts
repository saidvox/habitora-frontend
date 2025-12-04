import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTenant } from "../../api/tenants.api";
import type { CreateTenantPayload, Tenant } from "../../types/tenants.types";

export function useCreateTenantMutation(
    propiedadId: number,
    options?: { onSuccess?: () => void; onError?: () => void }
) {
    const qc = useQueryClient();

    return useMutation<Tenant, unknown, CreateTenantPayload>({
        mutationFn: payload => createTenant(propiedadId, payload),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tenants", propiedadId] });
            options?.onSuccess?.();
        },

        onError: () => options?.onError?.(),
    });
}
