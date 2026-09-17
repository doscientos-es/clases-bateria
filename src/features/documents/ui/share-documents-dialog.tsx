import {
  Button,
  Checkbox,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@doscientos/ui'
import { useState } from 'react'

import { describeError, useDemoSnapshot, type ShareResult } from '@/features/demo-data'
import { LoadingBlock } from '@/shared/ui/data-state'

import { useShareDocumentsWithStudents } from '../application/document-hooks'

/** Sends one or more documents to one or more students, with a summary before confirming. */
export function ShareDocumentsDialog({
  documentIds,
  isOpen,
  onOpenChange,
  onShared,
}: {
  documentIds: string[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onShared?: (result: ShareResult) => void
}) {
  const [studentIds, setStudentIds] = useState<string[]>([])
  const snapshot = useDemoSnapshot()
  const share = useShareDocumentsWithStudents()

  const students = (snapshot.data?.students ?? []).filter((student) => student.status === 'active')
  const documents = (snapshot.data?.documents ?? []).filter((document) =>
    documentIds.includes(document.id),
  )

  function toggle(studentId: string, selected: boolean) {
    setStudentIds((current) =>
      selected ? [...current, studentId] : current.filter((item) => item !== studentId),
    )
  }

  function close(open: boolean) {
    if (!open) {
      setStudentIds([])
      share.reset()
    }
    onOpenChange(open)
  }

  function confirm() {
    share.mutate(
      { documentIds, studentIds },
      {
        onSuccess: (result) => {
          onShared?.(result)
          close(false)
        },
      },
    )
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartir documentos</DialogTitle>
          <DialogDescription>
            Elige a los alumnos que recibirán acceso directo. No se envía ningún email.
          </DialogDescription>
        </DialogHeader>

        {snapshot.isPending ? <LoadingBlock label="Cargando alumnos…" /> : null}

        <div className="space-y-4">
          <section className="space-y-1" aria-label="Documentos seleccionados">
            <h3 className="text-sm font-semibold">
              {documents.length === 1
                ? '1 documento seleccionado'
                : `${documents.length} documentos seleccionados`}
            </h3>
            <ul className="text-muted-foreground list-inside list-disc text-sm">
              {documents.map((document) => (
                <li key={document.id}>{document.title}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2" aria-label="Alumnos destinatarios">
            <h3 className="text-sm font-semibold">Alumnos</h3>
            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {students.map((student) => (
                <Checkbox
                  key={student.id}
                  isSelected={studentIds.includes(student.id)}
                  onChange={(selected) => toggle(student.id, selected)}
                >
                  {student.name}
                </Checkbox>
              ))}
            </div>
          </section>

          <p className="text-muted-foreground text-sm" aria-live="polite">
            {studentIds.length === 0
              ? 'Selecciona al menos un alumno para continuar.'
              : `${documents.length} documento(s) quedarán visibles para ${studentIds.length} alumno(s).`}
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
            onPress={confirm}
            isDisabled={share.isPending || studentIds.length === 0 || documents.length === 0}
          >
            {share.isPending ? 'Compartiendo…' : 'Confirmar y compartir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
