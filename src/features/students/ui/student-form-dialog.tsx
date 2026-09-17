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
  Textarea,
} from '@doscientos/ui'
import { useState, type FormEvent } from 'react'

import { describeError, type CreateStudentInput, type Student } from '@/features/demo-data'

import { useCreateStudent, useUpdateStudent } from '../application/student-hooks'

const emptyForm: CreateStudentInput = { name: '', email: '', phone: '', notes: '' }

function formOf(student: Student | null): CreateStudentInput {
  if (!student) return emptyForm
  return {
    name: student.name,
    email: student.email,
    phone: student.phone,
    notes: student.notes,
  }
}

/** Creates a student or edits an existing one. Removals are never done here. */
export function StudentFormDialog({
  student,
  isOpen,
  onOpenChange,
}: {
  student: Student | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState<CreateStudentInput>(() => formOf(student))
  const [formKey, setFormKey] = useState(student?.id ?? 'new')
  const create = useCreateStudent()
  const update = useUpdateStudent(student?.id ?? '')
  const command = student ? update : create
  const currentKey = student?.id ?? 'new'

  if (currentKey !== formKey) {
    setFormKey(currentKey)
    setForm(formOf(student))
  }

  function change(field: keyof CreateStudentInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    command.mutate(form, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="space-y-4" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{student ? 'Editar alumno' : 'Añadir alumno'}</DialogTitle>
            <DialogDescription>
              Completa los datos del alumno para mantener actualizado el registro.
            </DialogDescription>
          </DialogHeader>

          <Field>
            <FieldLabel htmlFor="student-name">Nombre y apellidos</FieldLabel>
            <Input
              id="student-name"
              value={form.name}
              required
              onChange={(event) => change('name', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="student-email">Email</FieldLabel>
            <Input
              id="student-email"
              type="email"
              value={form.email}
              required
              onChange={(event) => change('email', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="student-phone">Teléfono (opcional)</FieldLabel>
            <Input
              id="student-phone"
              value={form.phone}
              onChange={(event) => change('phone', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="student-notes">Notas internas</FieldLabel>
            <Textarea
              id="student-notes"
              value={form.notes}
              onChange={(event) => change('notes', event.target.value)}
            />
          </Field>

          {command.error ? (
            <p className="text-destructive text-sm" role="alert">
              {describeError(command.error)}
            </p>
          ) : null}

          <DialogFooter>
            <Button variant="ghost" type="button" onPress={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" isDisabled={command.isPending}>
              {student ? 'Guardar cambios' : 'Crear alumno'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
