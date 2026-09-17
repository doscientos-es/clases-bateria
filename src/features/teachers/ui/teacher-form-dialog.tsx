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
} from '@doscientos/ui'
import { useState, type FormEvent } from 'react'

import { describeError, type CreateTeacherInput, type Teacher } from '@/features/demo-data'

import { useCreateTeacher, useUpdateTeacher } from '../application/teacher-hooks'

const emptyForm: CreateTeacherInput = { name: '', email: '', specialty: '' }

function formOf(teacher: Teacher | null): CreateTeacherInput {
  if (!teacher) return emptyForm
  return { name: teacher.name, email: teacher.email, specialty: teacher.specialty }
}

/** Creates a teacher or edits an existing one. Deactivation is never done here. */
export function TeacherFormDialog({
  teacher,
  isOpen,
  onOpenChange,
}: {
  teacher: Teacher | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState<CreateTeacherInput>(() => formOf(teacher))
  const [formKey, setFormKey] = useState(teacher?.id ?? 'new')
  const create = useCreateTeacher()
  const update = useUpdateTeacher(teacher?.id ?? '')
  const command = teacher ? update : create
  const currentKey = teacher?.id ?? 'new'

  if (currentKey !== formKey) {
    setFormKey(currentKey)
    setForm(formOf(teacher))
  }

  function change(field: keyof CreateTeacherInput, value: string) {
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
            <DialogTitle>{teacher ? 'Editar profesor' : 'Añadir profesor'}</DialogTitle>
            <DialogDescription>
              Completa los datos del profesor para mantener actualizado el equipo docente.
            </DialogDescription>
          </DialogHeader>

          <Field>
            <FieldLabel htmlFor="teacher-name">Nombre y apellidos</FieldLabel>
            <Input
              id="teacher-name"
              value={form.name}
              required
              onChange={(event) => change('name', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="teacher-email">Email</FieldLabel>
            <Input
              id="teacher-email"
              type="email"
              value={form.email}
              required
              onChange={(event) => change('email', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="teacher-specialty">Especialidad</FieldLabel>
            <Input
              id="teacher-specialty"
              value={form.specialty}
              required
              onChange={(event) => change('specialty', event.target.value)}
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
              {teacher ? 'Guardar cambios' : 'Crear profesor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
