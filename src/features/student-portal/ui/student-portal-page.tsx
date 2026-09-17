import {
  Badge,
  Button,
  Card,
  CardContent,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderTitle,
  PageStack,
} from '@doscientos/ui'
import { useState } from 'react'

import { useDemoSession } from '@/features/demo-auth'
import { useDemoSnapshot, useStudentLibrary, type VisibleDocument } from '@/features/demo-data'
import { ErrorBlock, EmptyBlock, LoadingBlock } from '@/shared/ui/data-state'
import { ProgressBar } from '@/shared/ui/progress-bar'

import { useMarkDocumentCompleted, useMarkDocumentViewed } from '../application/portal-hooks'

export function StudentPortalPage() {
  const { identity } = useDemoSession()
  const snapshot = useDemoSnapshot()
  const studentId = identity?.role === 'student' ? identity.id : ''
  const library = useStudentLibrary(studentId)
  const [selected, setSelected] = useState<string | null>(null)
  const viewed = useMarkDocumentViewed()
  const completed = useMarkDocumentCompleted()
  if (!studentId)
    return <ErrorBlock description="El portal solo está disponible para una identidad de alumno." />
  if (library.isPending || snapshot.isPending) return <LoadingBlock label="Cargando tu portal…" />
  if (library.isError || snapshot.isError)
    return <ErrorBlock onRetry={() => void library.refetch()} />
  const student = snapshot.data?.students.find((item) => item.id === studentId)
  const documents = library.data ?? []
  const directDocuments = documents.filter((item) => item.source !== 'class')
  const classDocuments = documents.filter((item) => item.source === 'class')
  const classes = (snapshot.data?.classes ?? []).filter(
    (item) => item.status === 'active' && item.studentIds.includes(studentId),
  )
  const completedCount = documents.filter((item) => item.completed).length
  const current = documents.find((item) => item.document.id === selected)
  function openDocument(documentId: string) {
    viewed.mutate({ documentId, studentId })
    setSelected(documentId)
  }
  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Hola, {student?.name.split(' ')[0] ?? identity?.name}</PageHeaderTitle>
          <PageHeaderDescription>
            Aquí tienes tus clases y la teoría que te han compartido.
          </PageHeaderDescription>
          <PageHeaderMeta>
            <Badge variant="outline">Portal del alumno</Badge>
            <span className="text-muted-foreground text-sm">{classes.length} clases</span>
          </PageHeaderMeta>
        </PageHeaderHeading>
      </PageHeader>
      <div className="portal-overview-grid">
        <div className="portal-overview-card">
          <p className="portal-overview-label">Progreso general</p>
          <ProgressBar
            completed={completedCount}
            total={documents.length}
            label="Teoría completada"
          />
        </div>
        <div className="portal-overview-card">
          <p className="portal-overview-label">Mis clases</p>
          {classes.length === 0 ? (
            <p className="text-muted-foreground text-sm">Todavía no tienes clases asignadas.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {classes.map((schoolClass) => (
                <li key={schoolClass.id}>
                  <Badge variant="secondary">{schoolClass.name}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <DocumentSection
        title="Para ti"
        description="Material que tus profesores han compartido directamente contigo."
        emptyTitle="No tienes envíos individuales"
        emptyDescription="Cuando recibas material personalizado aparecerá aquí."
        documents={directDocuments}
        onOpen={openDocument}
        onToggleCompleted={(documentId, isCompleted) =>
          completed.mutate({ documentId, studentId, completed: isCompleted })
        }
      />
      <DocumentSection
        title="De tus clases"
        description="Material compartido con los grupos a los que perteneces."
        emptyTitle="No hay material de tus clases"
        emptyDescription="Cuando tu profesor comparta teoría con una clase aparecerá aquí."
        documents={classDocuments}
        onOpen={openDocument}
        onToggleCompleted={(documentId, isCompleted) =>
          completed.mutate({ documentId, studentId, completed: isCompleted })
        }
      />
      <DialogRoot
        open={Boolean(current)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{current?.document.title}</DialogTitle>
            <DialogDescription>
              Consulta {current?.document.fileName}. Abrir el PDF registra la primera consulta.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted flex min-h-48 items-center justify-center rounded-lg p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Vista previa del documento
              <br />
              <span className="font-medium">{current?.document.fileName}</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onPress={() =>
                current &&
                completed.mutate({ documentId: current.document.id, studentId, completed: true })
              }
            >
              Marcar como completado
            </Button>
            <Button onPress={() => setSelected(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </PageStack>
  )
}

function DocumentSection({
  title,
  description,
  emptyTitle,
  emptyDescription,
  documents,
  onOpen,
  onToggleCompleted,
}: {
  title: string
  description: string
  emptyTitle: string
  emptyDescription: string
  documents: VisibleDocument[]
  onOpen: (documentId: string) => void
  onToggleCompleted: (documentId: string, completed: boolean) => void
}) {
  return (
    <section className="space-y-3" aria-label={title}>
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {documents.length === 0 ? (
        <EmptyBlock title={emptyTitle} description={emptyDescription} />
      ) : (
        <ul className="portal-document-grid">
          {documents.map((item) => (
            <li key={item.document.id}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium">{item.document.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {item.document.description || item.document.category}
                      </p>
                    </div>
                    <Badge variant={item.source === 'direct' ? 'outline' : 'secondary'}>
                      {item.source === 'direct' ? 'Para ti' : 'De tu clase'}
                    </Badge>
                  </div>
                  <div className="mt-auto space-y-3">
                    <p className="text-muted-foreground text-xs">
                      {item.completed ? 'Completado' : item.viewed ? 'Visto' : 'Sin abrir'} ·{' '}
                      {item.document.fileName}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onPress={() => onOpen(item.document.id)}>
                        Abrir PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() => onToggleCompleted(item.document.id, !item.completed)}
                      >
                        {item.completed ? 'Desmarcar' : 'Marcar completado'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
