// src/feature/payments/lib/paymentsStorage.ts

// ===== Tipos internos =====

export type ContractStateForPayments = "ACTIVO" | "CANCELADO" | "VIGENTE";

export type ContractMetaForPayments = {
  contractId: number;
  propertyId: number;
  tenantId: number;
  tenantName: string;
  roomId: number;
  roomCode: string;
  startDate: string; // ISO yyyy-MM-dd
  endDate: string; // ISO
  months: number;
  monthlyRent: number;
  signed: boolean;
  estado: ContractStateForPayments;
};

export type PaymentStatus = "PENDIENTE" | "PAGADO";

export type PaymentMethod = "EFECTIVO" | "YAPE" | "PLIN" | "TRANSFERENCIA" | "";

export type PaymentRecord = {
  id: string; // `${contractId}-${index}`
  contractId: number;
  propertyId: number;
  tenantName: string;
  roomCode: string;
  periodLabel: string; // "junio de 2025"
  dueDate: string; // ISO
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  paymentDate?: string; // ISO si está pagado
};

// ===== Helpers de fechas =====

export function addMonthsToISODate(startISO: string, months: number): string {
  const [y, m, d] = startISO.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  date.setMonth(date.getMonth() + months);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatISOToHuman(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function getPeriodLabelFromISO(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const date = new Date(y!, (m ?? 1) - 1, 1);
  return date.toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
  });
}

// ===== Claves de localStorage por propiedad =====

const STORAGE_PREFIX = "habitora-v1";

const contractsKey = (propertyId: number) =>
  `${STORAGE_PREFIX}:contracts-meta:property:${propertyId}`;

const paymentsKey = (propertyId: number) =>
  `${STORAGE_PREFIX}:payments:property:${propertyId}`;

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

// ===== Contratos (meta) =====

export function loadContractsMeta(
  propertyId: number
): ContractMetaForPayments[] {
  const raw = localStorage.getItem(contractsKey(propertyId));
  return safeParse<ContractMetaForPayments[]>(raw, []);
}

export function saveContractsMeta(
  propertyId: number,
  list: ContractMetaForPayments[]
) {
  localStorage.setItem(contractsKey(propertyId), JSON.stringify(list));
}

export function upsertContractMeta(meta: ContractMetaForPayments) {
  const list = loadContractsMeta(meta.propertyId);
  const idx = list.findIndex((c) => c.contractId === meta.contractId);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...meta };
  } else {
    list.push(meta);
  }
  saveContractsMeta(meta.propertyId, list);
}

export function markContractSigned(propertyId: number, contractId: number) {
  const list = loadContractsMeta(propertyId);
  const idx = list.findIndex((c) => c.contractId === contractId);
  if (idx === -1) return;

  list[idx].signed = true;
  list[idx].estado = "VIGENTE";
  saveContractsMeta(propertyId, list);
}

export function setContractState(
  propertyId: number,
  contractId: number,
  estado: ContractStateForPayments
) {
  const list = loadContractsMeta(propertyId);
  const idx = list.findIndex((c) => c.contractId === contractId);
  if (idx === -1) return;

  list[idx].estado = estado;
  saveContractsMeta(propertyId, list);
}

export function isContractSigned(
  propertyId: number,
  contractId: number
): boolean {
  const list = loadContractsMeta(propertyId);
  return !!list.find((c) => c.contractId === contractId && c.signed);
}

export function getContractMeta(
  propertyId: number,
  contractId: number
): ContractMetaForPayments | undefined {
  const list = loadContractsMeta(propertyId);
  return list.find((c) => c.contractId === contractId);
}

// ===== Pagos =====

export function loadPayments(propertyId: number): PaymentRecord[] {
  const raw = localStorage.getItem(paymentsKey(propertyId));
  return safeParse<PaymentRecord[]>(raw, []);
}

export function savePayments(propertyId: number, list: PaymentRecord[]) {
  localStorage.setItem(paymentsKey(propertyId), JSON.stringify(list));
}

/** Genera las cuotas mensuales para un contrato (si aún no tiene pagos). */
export function generatePaymentsForContract(
  propertyId: number,
  contractId: number
) {
  const meta = getContractMeta(propertyId, contractId);
  if (!meta) return;

  const existing = loadPayments(propertyId);
  const alreadyHasPayments = existing.some((p) => p.contractId === contractId);
  if (alreadyHasPayments) return;

  const payments: PaymentRecord[] = [];

  for (let i = 0; i < meta.months; i++) {
    const dueDate = addMonthsToISODate(meta.startDate, i);
    const periodLabel = getPeriodLabelFromISO(dueDate);

    payments.push({
      id: `${contractId}-${i + 1}`,
      contractId,
      propertyId,
      tenantName: meta.tenantName,
      roomCode: meta.roomCode,
      periodLabel,
      dueDate,
      amount: meta.monthlyRent,
      status: "PENDIENTE",
      method: "",
    });
  }

  savePayments(propertyId, [...existing, ...payments]);
}

export function markPaymentAsPaid(
  propertyId: number,
  paymentId: string,
  method: PaymentMethod
): PaymentRecord[] {
  const list = loadPayments(propertyId);
  const idx = list.findIndex((p) => p.id === paymentId);
  if (idx === -1) return list;

  const today = new Date();
  const iso = today.toISOString().slice(0, 10);

  list[idx] = {
    ...list[idx],
    status: "PAGADO",
    method,
    paymentDate: iso,
  };

  savePayments(propertyId, list);
  return list;
}

/**
 * Al FINALIZAR un contrato:
 * - marca el contrato como CANCELADO
 * - elimina SOLO los pagos pendientes de ese contrato
 *   (los pagados se quedan para el historial)
 */
export function onContractFinalized(propertyId: number, contractId: number) {
  setContractState(propertyId, contractId, "CANCELADO");

  const list = loadPayments(propertyId);
  const kept = list.filter(
    (p) => !(p.contractId === contractId && p.status === "PENDIENTE")
  );
  savePayments(propertyId, kept);
}
