export type PaymentStatus = "PENDIENTE" | "PAGADO" | "ANULADO";

export type PaymentMethod = "EFECTIVO" | "YAPE" | "PLIN" | "TRANSFERENCIA";

export type PaymentInstallment = {
  id: string;
  contractId: number;
  tenantName: string;
  roomCode: string;
  monthLabel: string;   // Ej: "Junio 2025"
  dueDate: string;      // ISO: "2025-06-21"
  amount: number;
  status: PaymentStatus;
  method?: PaymentMethod | null;
  paidAt?: string | null;
};
