import {
  Button,
  Checkbox,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Input,
} from '@doscientos/ui'
import { useState } from 'react'

import { describeError, useDemoSnapshot } from '@/features/demo-data'
import { useShareDocumentsWithStudents } from '@/features/documents'
import { matchesSearch } from '@/shared/lib/ids'

/** Sends documents to a single student from their profile. */
export function ShareWithStudentDialog({
  studentId,
  studentName,
  isOpen,
  onOpenChange,
}: {
  studentId: string
  studentName: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [search, setSearch] = useState('')
  const [documentIds, setDocumentIds] = useState<string[]>([])
  const snapshot = useDemoSnapshot()
  const share = useShareDocumentsWithStudents()

  const documents = (snapshot.data?.documents ?? []).filter(
    (document) =>
      document.status !== 'archived' &&
      matchesSearch(`${document.title} ${document.category}`, search),
  )

  function toggle(documentId: string, selected: boolean) {
    setDocumentIds((current) =>
      selected ? [...current, documentId] : current.filter((item) => item !== documentId),
    )
  }

  function close(open: boolean) {
    if (!open) {
      setDocumentIds([])
      setSearch('')
      share.reset()
    }
    onOpenChange(open)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartir con {studentName}</DialogTitle>
          <DialogDescription>
            Los documentos seleccionados quedarán visibles solo para este alumno.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            aria-label="Buscar documentos"
            placeholder="Buscar por título o materia"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {documents.map((document) => (
              <Checkbox
                key={document.id}
                isSelected={documentIds.includes(document.id)}
                onChange={(selected) => toggle(document.id, selected)}
              >
                {document.title}
              </Checkbox>
            ))}
          </div>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            {documentIds.length === 0
              ? 'Selecciona al menos un documento.'
              : `${documentIds.length} documento(s) para ${studentName}.`}
          </p>
          {share.error ? (
            <p className="text-destructive text-sm" role="alert">
              {describeError(share.error)}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onPress={() => close(false)}>
            Cancelar
          </Button>
          <Button
            isDisabled={share.isPending || documentIds.length === 0}
            onPress={() =>
              share.mutate(
                { documentIds, studentIds: [studentId] },
                { onSuccess: () => close(false) },
              )
            }
          >
            {share.isPending ? 'Compartiendo…' : 'Confirmar y compartir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
