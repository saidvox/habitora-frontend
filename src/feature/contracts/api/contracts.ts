// src/feature/contracts/api/contracts.ts
import axiosInstance from "@/lib/axios";
import type {
  ContratoListado,
  ContratosFilters,
  ContratoDetalle,
  CrearContratoPayload,
  AvailableRoomsByFloor,
  Tenant,
  TenantsFilters,
} from "../types";

// Helper: limpia el dataURL y deja solo el base64
export const stripBase64Prefix = (value: string): string => {
  const commaIndex = value.indexOf(",");
  if (value.startsWith("data:image") && commaIndex !== -1) {
    return value.slice(commaIndex + 1);
  }
  return value;
};

// --------- CONTRATOS ---------

export async function getContractsByProperty(
  propertyId: number,
  filters?: ContratosFilters
): Promise<ContratoListado[]> {
  const response = await axiosInstance.get<ContratoListado[]>(
    `/api/propiedades/${propertyId}/contratos`,
    {
      params: {
        estado: filters?.estado,
        search: filters?.search,
      },
    }
  );
  return response.data;
}

export { getContractsByProperty as getContratosByPropiedad };

export async function getContractById(
  propertyId: number,
  contractId: number
): Promise<ContratoDetalle> {
  const response = await axiosInstance.get<ContratoDetalle>(
    `/api/propiedades/${propertyId}/contratos/${contractId}`
  );
  return response.data;
}

export async function createContract(
  propertyId: number,
  payload: CrearContratoPayload
): Promise<ContratoDetalle> {
  const response = await axiosInstance.post<ContratoDetalle>(
    `/api/propiedades/${propertyId}/contratos`,
    payload
  );
  return response.data;
}

export { createContract as crearContrato };

export async function finalizeContract(
  propertyId: number,
  contractId: number
): Promise<ContratoDetalle> {
  const response = await axiosInstance.put<ContratoDetalle>(
    `/api/propiedades/${propertyId}/contratos/${contractId}/finalizar`
  );
  return response.data;
}

export { finalizeContract as finalizarContrato };

// ========== FIRMA DIGITAL (CORREGIDO) ==========

export async function uploadContractSignature(
  propertyId: number,
  contractId: number,
  base64: string
): Promise<ContratoDetalle> {
  const cleanBase64 = stripBase64Prefix(base64);

  // Convertir base64 → Blob
  const byteCharacters = atob(cleanBase64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });

  // Crear FormData
  const formData = new FormData();
  formData.append("file", blob, "firma.png");

  const response = await axiosInstance.post<ContratoDetalle>(
    `/api/propiedades/${propertyId}/contratos/${contractId}/firma`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}

export { uploadContractSignature as subirFirmaContrato };

// GET: descargar firma
export async function downloadContractSignatureAsBlob(
  propertyId: number,
  contractId: number
): Promise<Blob> {
  const response = await axiosInstance.get(
    `/api/propiedades/${propertyId}/contratos/${contractId}/firma`,
    {
      responseType: "blob",
    }
  );
  return response.data;
}

// --------- HABITACIONES DISPONIBLES ---------

export async function getAvailableRoomsByProperty(
  propertyId: number
): Promise<AvailableRoomsByFloor[]> {
  const response = await axiosInstance.get<AvailableRoomsByFloor[]>(
    `/api/propiedades/${propertyId}/habitaciones`,
    {
      params: { estado: "DISPONIBLE" },
    }
  );
  return response.data;
}

// --------- INQUILINOS ---------

export async function getTenantsByProperty(
  propertyId: number,
  filters?: TenantsFilters
): Promise<Tenant[]> {
  const response = await axiosInstance.get<Tenant[]>(
    `/api/propiedades/${propertyId}/inquilinos`,
    {
      params: {
        disponibles: filters?.disponibles,
        query: filters?.query,
      },
    }
  );
  return response.data;
}
