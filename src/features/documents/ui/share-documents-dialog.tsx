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

import {
  buildStudentLibrary,
  describeError,
  useDemoSnapshot,
  type ShareResult,
} from '@/features/demo-data'
import { LoadingBlock } from '@/shared/ui/data-state'
import { PersonAvatar } from '@/shared/ui/person-avatar'

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
  const [search, setSearch] = useState('')
  const snapshot = useDemoSnapshot()
  const share = useShareDocumentsWithStudents()

  const students = (snapshot.data?.students ?? []).filter((student) => student.status === 'active')
  const documents = (snapshot.data?.documents ?? []).filter((document) =>
    documentIds.includes(document.id),
  )
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  )
  const accessByStudent = new Map(
    snapshot.data
      ? students.map((student) => [
          student.id,
          new Set(buildStudentLibrary(snapshot.data, student.id).map((item) => item.document.id)),
        ])
      : [],
  )

  function toggle(studentId: string, selected: boolean) {
    setStudentIds((current) =>
      selected ? [...current, studentId] : current.filter((item) => item !== studentId),
    )
  }

  function close(open: boolean) {
    if (!open) {
      setStudentIds([])
      setSearch('')
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
            <Input
              aria-label="Buscar alumnos"
              placeholder="Buscar alumno por nombre o email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {filteredStudents.map((student) => {
                const existing = documents.filter((document) =>
                  accessByStudent.get(student.id)?.has(document.id),
                )
                const blocked = existing.length > 0
                return (
                  <Checkbox
                    key={student.id}
                    isSelected={studentIds.includes(student.id)}
                    isDisabled={blocked}
                    onChange={(selected) => toggle(student.id, selected)}
                  >
                    <span className="student-share-option">
                      <PersonAvatar person={student} size={28} />
                      <span>
                        {student.name}{' '}
                        <small className="text-muted-foreground">
                          {blocked
                            ? `· Ya tiene ${existing.map((item) => item.title).join(', ')}`
                            : ''}
                        </small>
                      </span>
                    </span>
                  </Checkbox>
                )
              })}
            </div>
          </section>

          {documents.length > 0 &&
          students.some((student) =>
            documents.some((document) => accessByStudent.get(student.id)?.has(document.id)),
          ) ? (
            <p className="share-warning" role="status">
              Los alumnos que ya tienen alguno de estos documentos aparecen bloqueados. No se creará
              un acceso duplicado.
            </p>
          ) : null}

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
