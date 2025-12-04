import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTenant } from "../../api/tenants.api";
import type { UpdateTenantPayload, Tenant } from "../../types/tenants.types";

export function useUpdateTenantMutation(
    propiedadId: number,
    tenantId: number,
    options?: { onSuccess?: () => void; onError?: () => void }
) {
    const qc = useQueryClient();

    return useMutation<Tenant, unknown, UpdateTenantPayload>({
        mutationFn: payload => updateTenant(propiedadId, tenantId, payload),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tenants", propiedadId] });
            options?.onSuccess?.();
        },

        onError: () => options?.onError?.(),
    });
}
