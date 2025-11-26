// src/feature/contracts/types.ts

export type ContratoEstado = "ACTIVO" | "CANCELADO";

export type ContratoListado = {
  id: number;
  estado: ContratoEstado | string;
  fechaInicio: string;
  fechaFin: string;
  montoDeposito: number;
  inquilinoId: number;
  inquilinoNombre: string;
  inquilinoDni: string;
  habitacionId: number;
  habitacionCodigo: string;
  tieneFirma: boolean;
};

export type ContratoDetalle = {
  id: number;
  propiedadId: number;
  estado: ContratoEstado | string;
  fechaInicio: string;
  fechaFin: string;
  montoDeposito: number;
  inquilinoId: number;
  inquilinoNombre: string;
  inquilinoDni: string;
  inquilinoEmail: string;
  inquilinoTelefono: string;
  habitacionId: number;
  habitacionCodigo: string;
  habitacionEstado: string;
  habitacionPrecioRenta: string;
  tieneFirma: boolean;
};

export type ContratosFilters = {
  estado?: ContratoEstado;
  search?: string;
};

export type CrearContratoPayload = {
  inquilinoId: number;
  habitacionId: number;
  fechaInicio: string;
  fechaFin: string;
  montoDeposito: number;
};

export type SubirFirmaContratoPayload = {
  file: string; // ya no se usa con multipart, pero se deja por compatibilidad
};

export type AvailableRoom = {
  id: number;
  propiedadId: number;
  pisoId: number;
  codigo: string;
  estado: string;
  precioRenta: string;
};

export type AvailableRoomsByFloor = {
  pisoId: number;
  numeroPiso: number;
  habitaciones: AvailableRoom[];
};

export type Tenant = {
  id: number;
  nombreCompleto: string;
  numeroDni: string;
  email: string;
  telefonoWhatsapp: string;
  cantidadContratos: number;
};

export type TenantsFilters = {
  disponibles?: boolean;
  query?: string;
};
