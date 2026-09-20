import {
  Badge,
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
import { Eye, FileText } from 'lucide-react'
import { useState } from 'react'

import {
  buildStudentLibrary,
  describeError,
  useDemoSnapshot,
  type VisibleDocument,
} from '@/features/demo-data'
import { useShareDocumentsWithStudents } from '@/features/documents'
import { matchesSearch } from '@/shared/lib/ids'
import { LoadingBlock } from '@/shared/ui/data-state'

/** Shows a student's shared documents and sends new documents from the library. */
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

  const library = snapshot.data ? buildStudentLibrary(snapshot.data, studentId) : []
  const sharedDocumentIds = new Set(library.map((item) => item.document.id))
  const documents = (snapshot.data?.documents ?? []).filter(
    (document) =>
      document.status !== 'archived' &&
      !sharedDocumentIds.has(document.id) &&
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
      <DialogContent className="sm:max-w-3xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Documentos de {studentName}</DialogTitle>
          <DialogDescription>
            Consulta el material disponible para este alumno y añade nuevos recursos directamente
            desde la biblioteca.
          </DialogDescription>
        </DialogHeader>

        {snapshot.isPending ? <LoadingBlock label="Cargando documentos…" /> : null}

        <div className="space-y-6">
          <section className="space-y-3" aria-label="Documentos compartidos">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">Material compartido</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {library.length === 0
                    ? 'Todavía no tiene documentos disponibles.'
                    : `${library.length} documento${library.length === 1 ? '' : 's'} disponibles`}
                </p>
              </div>
              <Badge variant="secondary">Actividad de demo</Badge>
            </div>
            {library.length > 0 ? (
              <ul className="grid max-h-72 gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                {library.map((item) => (
                  <StudentDocumentRow item={item} studentId={studentId} key={item.document.id} />
                ))}
              </ul>
            ) : null}
          </section>

          <section className="border-border space-y-3 border-t pt-5" aria-label="Añadir documentos">
            <div>
              <h3 className="text-sm font-semibold">Añadir desde la biblioteca</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Selecciona uno o varios documentos para compartirlos solo con {studentName}.
              </p>
            </div>
            <Input
              aria-label="Buscar documentos en la biblioteca"
              placeholder="Buscar por título o materia"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {documents.length > 0 ? (
                documents.map((document) => (
                  <Checkbox
                    key={document.id}
                    isSelected={documentIds.includes(document.id)}
                    onChange={(selected) => toggle(document.id, selected)}
                  >
                    <span className="flex items-center gap-2">
                      <FileText aria-hidden className="text-muted-foreground size-4" />
                      <span>
                        {document.title}
                        <small className="text-muted-foreground ml-2">{document.category}</small>
                      </span>
                    </span>
                  </Checkbox>
                ))
              ) : (
                <p className="text-muted-foreground py-3 text-sm">
                  No hay más documentos que añadir con esta búsqueda.
                </p>
              )}
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
          </section>
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

function StudentDocumentRow({ item, studentId }: { item: VisibleDocument; studentId: string }) {
  const views = item.viewed ? demoViewCount(studentId, item.document.id) : 0
  const sourceLabel =
    item.source === 'both'
      ? 'Directo + clase'
      : item.source === 'direct'
        ? 'Directo'
        : 'De su clase'

  return (
    <li className="border-border rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <FileText aria-hidden className="text-primary mt-0.5 size-4 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.document.title}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {item.document.category} · {item.document.level}
            </p>
          </div>
        </div>
        <Badge variant={item.source === 'direct' ? 'outline' : 'secondary'}>{sourceLabel}</Badge>
      </div>
      <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1">
          <Eye aria-hidden className="size-3.5" />
          {views} {views === 1 ? 'vista' : 'vistas'}
        </span>
        <span>{item.completed ? 'Completado' : item.viewed ? 'Visto' : 'Sin abrir'}</span>
      </div>
    </li>
  )
}

/** Stable illustrative view count for the demo; the repository currently stores only viewed/not viewed. */
function demoViewCount(studentId: string, documentId: string): number {
  const seed = Array.from(`${studentId}:${documentId}`).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  )
  return 2 + (seed % 7)
}
