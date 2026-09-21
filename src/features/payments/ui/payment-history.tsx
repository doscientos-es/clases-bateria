import { Button } from '@doscientos/ui'
import { Banknote, CreditCard, Landmark, WalletCards } from 'lucide-react'

import type { PaymentMethod, StudentPayment } from '@/features/demo-data'

import { useRemovePayment, useStudentPayments } from '../application/payment-hooks'
import { formatPaymentDate, paymentMethodLabel, totalPayments } from '../domain/payment-format'

export function PaymentHistory({
  studentId,
  title = 'Historial de pagos',
  canManage = false,
}: {
  studentId: string
  title?: string
  canManage?: boolean
}) {
  const payments = useStudentPayments(studentId)
  const remove = useRemovePayment()

  if (payments.isPending) {
    return <p className="text-muted-foreground text-sm">Cargando historial de pagos…</p>
  }
  if (payments.isError) {
    return <p className="text-destructive text-sm">No se ha podido cargar el historial de pagos.</p>
  }

  const entries = payments.data ?? []
  return (
    <section className="payment-history" aria-label={title}>
      <div className="payment-history-heading">
        <div>
          <h2>{title}</h2>
          <p>
            {entries.length} {entries.length === 1 ? 'pago registrado' : 'pagos registrados'}
          </p>
        </div>
        <strong>{formatAmount(totalPayments(entries))}</strong>
      </div>
      {entries.length === 0 ? (
        <p className="payment-empty">Todavía no hay pagos registrados para este alumno.</p>
      ) : (
        <div className="payment-list">
          {entries.map((payment) => (
            <PaymentRow
              key={payment.id}
              payment={payment}
              canManage={canManage}
              isRemoving={remove.isPending}
              onRemove={() => remove.mutate(payment.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function PaymentRow({
  payment,
  canManage,
  isRemoving,
  onRemove,
}: {
  payment: StudentPayment
  canManage: boolean
  isRemoving: boolean
  onRemove: () => void
}) {
  return (
    <article className="payment-row">
      <span className="payment-method-icon" aria-hidden>
        <PaymentMethodIcon method={payment.method} />
      </span>
      <div className="min-w-0 flex-1">
        <strong>{formatAmount(payment.amount)}</strong>
        <p>
          {formatPaymentDate(payment.paidOn)} · {paymentMethodLabel(payment.method)}
        </p>
        {payment.note ? <small>{payment.note}</small> : null}
      </div>
      {canManage ? (
        <Button
          size="sm"
          variant="ghost"
          onPress={onRemove}
          isDisabled={isRemoving}
          aria-label={`Eliminar pago de ${formatAmount(payment.amount)}`}
        >
          Eliminar
        </Button>
      ) : null}
    </article>
  )
}

function PaymentMethodIcon({ method }: { method: PaymentMethod }) {
  if (method === 'cash') return <Banknote />
  if (method === 'transfer') return <Landmark />
  if (method === 'card') return <CreditCard />
  return <WalletCards />
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}
