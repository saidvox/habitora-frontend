import type { Tenant } from "../types/tenants.types";
import type { TenantDTO } from "../schemas/tenants.schema";

export function mapTenant(dto: TenantDTO): Tenant {
    return {
        id: dto.id,
        nombreCompleto: dto.nombreCompleto.trim(),
        numeroDni: dto.numeroDni,
        email: dto.email,
        telefonoWhatsapp: dto.telefonoWhatsapp,
        cantidadContratos: dto.cantidadContratos ?? 0,
    };
}

export function mapTenants(list: TenantDTO[]): Tenant[] {
    return list.map(mapTenant);
}
