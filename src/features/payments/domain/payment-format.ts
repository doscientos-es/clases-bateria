import type { PaymentMethod, StudentPayment } from '@/features/demo-data'

export function paymentMethodLabel(method: PaymentMethod): string {
  if (method === 'transfer') return 'Transferencia'
  if (method === 'cash') return 'Efectivo'
  if (method === 'card') return 'Tarjeta'
  return 'Otro método'
}

export function formatPaymentDate(value: string): string {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Fecha no válida'
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(date)
}

export function totalPayments(payments: StudentPayment[]): number {
  return payments.reduce((total, payment) => total + payment.amount, 0)
}