import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Textarea,
} from '@doscientos/ui'
import { useState, type FormEvent } from 'react'

import { describeError, type CreateDocumentInput, type DocumentItem } from '@/features/demo-data'

import { useCreateDocument, useUpdateDocument } from '../application/document-hooks'

const emptyForm: CreateDocumentInput = {
  title: '',
  description: '',
  category: '',
  level: '',
  fileName: '',
}

function formOf(document: DocumentItem | null): CreateDocumentInput {
  if (!document) return emptyForm
  return {
    title: document.title,
    description: document.description,
    category: document.category,
    level: document.level,
    fileName: document.fileName,
  }
}

/** Uploads a document or edits its metadata. A new document is always private. */
export function DocumentFormDialog({
  document,
  isOpen,
  onOpenChange,
}: {
  document: DocumentItem | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState<CreateDocumentInput>(() => formOf(document))
  const [formKey, setFormKey] = useState(document?.id ?? 'new')
  const create = useCreateDocument()
  const update = useUpdateDocument(document?.id ?? '')
  const command = document ? update : create
  const currentKey = document?.id ?? 'new'

  if (currentKey !== formKey) {
    setFormKey(currentKey)
    setForm(formOf(document))
  }

  function change(field: keyof CreateDocumentInput, value: string) {
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
            <DialogTitle>{document ? 'Editar documento' : 'Subir documento'}</DialogTitle>
            <DialogDescription>
              Subir un documento no da acceso a ningún alumno: se comparte después.
            </DialogDescription>
          </DialogHeader>

          <Field>
            <FieldLabel htmlFor="document-title">Título</FieldLabel>
            <Input
              id="document-title"
              value={form.title}
              required
              onChange={(event) => change('title', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="document-description">Descripción corta</FieldLabel>
            <Textarea
              id="document-description"
              value={form.description}
              onChange={(event) => change('description', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="document-category">Materia</FieldLabel>
            <Input
              id="document-category"
              value={form.category}
              required
              onChange={(event) => change('category', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="document-level">Nivel</FieldLabel>
            <Input
              id="document-level"
              value={form.level}
              required
              onChange={(event) => change('level', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="document-file">Archivo PDF</FieldLabel>
            <Input
              id="document-file"
              value={form.fileName}
              required
              onChange={(event) => change('fileName', event.target.value)}
            />
            <FieldDescription>
              La demo no sube archivos reales: se guarda solo el nombre del PDF.
            </FieldDescription>
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
              {document ? 'Guardar cambios' : 'Subir documento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
