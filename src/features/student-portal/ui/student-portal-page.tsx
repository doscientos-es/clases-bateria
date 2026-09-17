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
import { useDemoSnapshot, useStudentLibrary } from '@/features/demo-data'
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
      <ProgressBar completed={completedCount} total={documents.length} label="Tu progreso" />
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Mis clases</h2>
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
      </section>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Documentos disponibles</h2>
        {documents.length === 0 ? (
          <EmptyBlock
            title="Todavía no tienes documentos"
            description="Cuando tu profesor comparta teoría aparecerá aquí."
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {documents.map((item) => (
              <li key={item.document.id}>
                <Card>
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{item.document.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {item.document.description || item.document.category}
                        </p>
                      </div>
                      <Badge variant={item.source === 'direct' ? 'outline' : 'secondary'}>
                        {item.source === 'direct' ? 'Para ti' : 'De tu clase'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {item.completed ? 'Completado' : item.viewed ? 'Visto' : 'Sin abrir'} ·{' '}
                      {item.document.fileName}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onPress={() => openDocument(item.document.id)}>
                        Abrir PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() =>
                          completed.mutate({
                            documentId: item.document.id,
                            studentId,
                            completed: !item.completed,
                          })
                        }
                      >
                        {item.completed ? 'Desmarcar' : 'Marcar completado'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
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
              Visor de demo para {current?.document.fileName}. Abrir el PDF registra la primera
              consulta.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted flex min-h-48 items-center justify-center rounded-lg p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Vista previa PDF de la demo
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
