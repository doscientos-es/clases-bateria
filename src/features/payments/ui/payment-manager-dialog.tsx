import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Field,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@doscientos/ui'
import { useState, type FormEvent } from 'react'

import { describeError, type PaymentMethod, type Student } from '@/features/demo-data'
import { todayIso } from '@/shared/lib/dates'

import { useCreatePayment } from '../application/payment-hooks'
import { PaymentHistory } from './payment-history'

const paymentMethods: { id: PaymentMethod; label: string }[] = [
  { id: 'transfer', label: 'Transferencia bancaria' },
  { id: 'cash', label: 'Efectivo' },
  { id: 'card', label: 'Tarjeta' },
  { id: 'other', label: 'Otro método' },
]

export function PaymentManagerDialog({
  student,
  isOpen,
  onOpenChange,
}: {
  student: Student | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const create = useCreatePayment()
  const [amount, setAmount] = useState('')
  const [paidOn, setPaidOn] = useState(todayIso)
  const [method, setMethod] = useState<PaymentMethod>('transfer')
  const [note, setNote] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!student) return
    create.mutate(
      { studentId: student.id, amount: Number(amount), paidOn, method, note },
      {
        onSuccess: () => {
          setAmount('')
          setNote('')
        },
      },
    )
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar cobros</DialogTitle>
          <DialogDescription>
            Registra manualmente los pagos recibidos de {student?.name}. Esto no genera facturas ni
            inicia ningún cobro online.
          </DialogDescription>
        </DialogHeader>
        {student ? (
          <PaymentHistory studentId={student.id} title="Pagos registrados" canManage />
        ) : null}
        <form className="payment-form" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="payment-amount">Importe (€)</FieldLabel>
              <Input
                id="payment-amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amount}
                placeholder="45,00"
                onChange={(event) => setAmount(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="payment-date">Fecha del pago</FieldLabel>
              <Input
                id="payment-date"
                type="date"
                required
                value={paidOn}
                onChange={(event) => setPaidOn(event.target.value)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="payment-method">Método</FieldLabel>
            <Select
              id="payment-method"
              aria-label="Método de pago"
              selectedKey={method}
              onSelectionChange={(key) => setMethod(String(key) as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectList>
                  {paymentMethods.map((item) => (
                    <SelectItem key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectList>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="payment-note">Nota (opcional)</FieldLabel>
            <Textarea
              id="payment-note"
              value={note}
              placeholder="Ej. Mensualidad de septiembre"
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          {create.error ? (
            <p className="text-destructive text-sm" role="alert">
              {describeError(create.error)}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="ghost" onPress={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button type="submit" isDisabled={create.isPending || !student}>
              Registrar pago
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
