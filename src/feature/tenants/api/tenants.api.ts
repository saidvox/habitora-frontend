import axiosInstance from "@/lib/axios";
import { mapTenant, mapTenants } from "../utils/tenants.mappers";
import type {
    Tenant,
    CreateTenantPayload,
    UpdateTenantPayload,
} from "../types/tenants.types";

export async function getTenantsByProperty(propiedadId: number): Promise<Tenant[]> {
    const { data } = await axiosInstance.get(`/api/propiedades/${propiedadId}/inquilinos`);
    return mapTenants(data);
}

export async function getTenantById(propiedadId: number, tenantId: number): Promise<Tenant> {
    const { data } = await axiosInstance.get(`/api/propiedades/${propiedadId}/inquilinos/${tenantId}`);
    return mapTenant(data);
}

export async function createTenant(propiedadId: number, payload: CreateTenantPayload): Promise<Tenant> {
    const { data } = await axiosInstance.post(`/api/propiedades/${propiedadId}/inquilinos`, payload);
    return mapTenant(data);
}

export async function updateTenant(propiedadId: number, tenantId: number, payload: UpdateTenantPayload): Promise<Tenant> {
    const { data } = await axiosInstance.put(`/api/propiedades/${propiedadId}/inquilinos/${tenantId}`, payload);
    return mapTenant(data);
}

export async function deleteTenant(propiedadId: number, tenantId: number): Promise<void> {
    await axiosInstance.delete(`/api/propiedades/${propiedadId}/inquilinos/${tenantId}`);
}

export async function searchTenants(propiedadId: number, query: string): Promise<Tenant[]> {
    const { data } = await axiosInstance.get(`/api/propiedades/${propiedadId}/inquilinos/search`, {
        params: { query },
    });
    return mapTenants(data);
}

export async function lookupTenantNameByDni(dni: string): Promise<{ nombreCompleto?: string }> {
    const { data } = await axiosInstance.get(`/api/dni/lookup`, { params: { dni } });
    return data;
}
