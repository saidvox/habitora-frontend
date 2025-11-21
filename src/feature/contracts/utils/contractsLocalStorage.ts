// src/feature/contracts/utils/contractsLocalStorage.ts

import {
  isContractSigned as isSignedFromPayments,
  markContractSigned,
  generatePaymentsForContract,
  loadPayments,
  markPaymentAsPaid,
  type PaymentRecord,
  type PaymentMethod,
  onContractFinalized,
} from "@/feature/payments/lib/paymentsStorage";

// === Firma / estado ===

export function isContractSigned(propertyId: number, contractId: number) {
  return isSignedFromPayments(propertyId, contractId);
}

export function markContractSignedAndGeneratePayments(args: {
  propertyId: number;
  contractId: number;
}) {
  markContractSigned(args.propertyId, args.contractId);
  generatePaymentsForContract(args.propertyId, args.contractId);
}

// === Pagos (por si algo viejo lo usa) ===

export function getPaymentsForProperty(
  propertyId: number
): PaymentRecord[] {
  return loadPayments(propertyId);
}

export function confirmPayment(args: {
  propertyId: number;
  paymentId: string;
  method: string;
}) {
  markPaymentAsPaid(
    args.propertyId,
    args.paymentId,
    args.method as PaymentMethod
  );
}

// Re-export para finalizar contrato desde la UI
export { onContractFinalized };
