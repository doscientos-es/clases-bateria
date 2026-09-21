import { createId } from '../../../shared/lib/ids'
import type { CreatePaymentInput, PaymentRepository } from '../application/repositories'
import type { DemoData, StudentPayment } from '../domain/entities'
import { DemoError } from '../domain/errors'
import type { DemoStore } from './local-store'

function requireStudent(data: DemoData, studentId: string): void {
  if (!data.students.some((student) => student.id === studentId)) {
    throw new DemoError('not-found', 'No se ha encontrado el alumno indicado.')
  }
}

function validateInput(input: CreatePaymentInput): void {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new DemoError('validation', 'El importe debe ser mayor que cero.')
  }
  if (!input.paidOn) throw new DemoError('validation', 'Indica la fecha del pago.')
}

export function createMockPaymentRepository(store: DemoStore): PaymentRepository {
  return {
    listByStudent(studentId) {
      const payments = store
        .read()
        .payments.filter((payment) => payment.studentId === studentId)
        .sort((a, b) => b.paidOn.localeCompare(a.paidOn))
      return Promise.resolve(payments)
    },
    create(input) {
      const data = store.read()
      requireStudent(data, input.studentId)
      validateInput(input)
      const payment: StudentPayment = {
        id: createId('payment'),
        studentId: input.studentId,
        amount: Math.round(input.amount * 100) / 100,
        paidOn: input.paidOn,
        method: input.method,
        note: input.note.trim(),
      }
      store.write({ ...data, payments: [...data.payments, payment] })
      return Promise.resolve(payment)
    },
    remove(id) {
      const data = store.read()
      if (!data.payments.some((payment) => payment.id === id)) {
        throw new DemoError('not-found', 'No se ha encontrado el cobro indicado.')
      }
      store.write({ ...data, payments: data.payments.filter((payment) => payment.id !== id) })
      return Promise.resolve()
    },
  }
}
