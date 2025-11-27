export type EstadoFactura = "ABIERTA" | "PAGADA" | "VENCIDA" | "CANCELADA";

export type MetodoPago = "EFECTIVO" | "YAPE" | "PLIN" | "TRANSFERENCIA";

export interface Factura {
  id: number;
  contratoId: number;
  inquilinoId: number;
  inquilinoNombre: string;
  habitacionId: number;
  habitacionCodigo: string;
  periodoInicio: string; // yyyy-MM-dd
  periodoFin: string;
  fechaVencimiento: string;
  montoRenta: number;
  estado: EstadoFactura;
  esPagada: boolean;
  esVencida: boolean;
  diasRetraso: number;
}

export interface Pago {
  id: number;
  facturaId: number;
  contratoId: number;
  inquilinoId: number;
  inquilinoNombre: string;
  habitacionId: number;
  habitacionCodigo: string;
  mes: string; // "Junio 2025"
  fechaPago: string;
  monto: number;
  metodo: string;
  estado: string;
}

export interface PagoCreateRequest {
  fechaPago: string; // yyyy-MM-dd
  monto: number;
  metodo: MetodoPago;
  firmaBase64?: string; // Firma digital del inquilino
}
