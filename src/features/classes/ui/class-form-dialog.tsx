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

import { describeError, type CreateClassInput, type SchoolClass } from '@/features/demo-data'

import { useCreateClass, useUpdateClass } from '../application/class-hooks'

const emptyForm: CreateClassInput = {
  name: '',
  description: '',
  level: 'Inicial',
  teacherIds: [],
  studentIds: [],
  scheduledAt: null,
}

const classLevels = ['Inicial', 'Intermedio', 'Avanzado'] as const

function formOf(schoolClass: SchoolClass | null): CreateClassInput {
  if (!schoolClass) return emptyForm
  return {
    ...schoolClass,
    teacherIds: [...schoolClass.teacherIds],
    studentIds: [...schoolClass.studentIds],
    scheduledAt: schoolClass.scheduledAt,
  }
}

export function ClassFormDialog({
  schoolClass,
  isOpen,
  onOpenChange,
}: {
  schoolClass: SchoolClass | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState(() => formOf(schoolClass))
  const [formKey, setFormKey] = useState(schoolClass?.id ?? 'new')
  const create = useCreateClass()
  const update = useUpdateClass(schoolClass?.id ?? '')
  const command = schoolClass ? update : create
  const currentKey = schoolClass?.id ?? 'new'

  if (currentKey !== formKey) {
    setFormKey(currentKey)
    setForm(formOf(schoolClass))
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
            <DialogTitle>{schoolClass ? 'Editar clase' : 'Nueva clase'}</DialogTitle>
            <DialogDescription>
              Después podrás añadir alumnos y preparar su itinerario.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="class-name">Nombre</FieldLabel>
            <Input
              id="class-name"
              value={form.name}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="class-level">Nivel</FieldLabel>
            <Select
              id="class-level"
              aria-label="Nivel de la clase"
              isRequired
              selectedKey={form.level}
              onSelectionChange={(key) => setForm({ ...form, level: String(key) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectList>
                  {classLevels.map((level) => (
                    <SelectItem key={level} id={level} textValue={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectList>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="class-description">Descripción</FieldLabel>
            <Textarea
              id="class-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="class-scheduled-at">Fecha y hora de la clase</FieldLabel>
            <Input
              id="class-scheduled-at"
              type="datetime-local"
              value={form.scheduledAt ?? ''}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value ? e.target.value : null })
              }
            />
            <p className="text-muted-foreground text-xs">
              La verán los alumnos asignados y aparecerá en tu calendario.
            </p>
          </Field>
          {command.error ? (
            <p className="text-destructive text-sm" role="alert">
              {describeError(command.error)}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="ghost" onPress={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" isDisabled={command.isPending}>
              {schoolClass ? 'Guardar cambios' : 'Crear clase'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
