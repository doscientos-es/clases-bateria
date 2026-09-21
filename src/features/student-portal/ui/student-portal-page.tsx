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
  PageStack,
} from '@doscientos/ui'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'

import { useDemoSession } from '@/features/demo-auth'
import { useDemoSnapshot, useStudentLibrary, type VisibleDocument } from '@/features/demo-data'
import { PaymentHistory } from '@/features/payments'
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
      <section className="student-home-hero">
        <div>
          <p className="student-home-eyebrow">Tu espacio de aprendizaje</p>
          <h1>Hola, {student?.name.split(' ')[0] ?? identity?.name}</h1>
          <p>Qué bueno tenerte de vuelta. La música sigue aquí para ti.</p>
        </div>
        <img
          src="/assets/music-classroom-hero.png"
          alt="Espacio de estudio musical con metrónomo y partituras"
          className="student-portal-hero-image"
        />
      </section>
      <div className="student-home-top-grid">
        <section className="student-home-section">
          <div className="student-home-section-heading">
            <div>
              <p className="student-home-eyebrow">Ahora mismo</p>
              <h2>Tus clases</h2>
            </div>
            <span className="student-home-count">{classes.length} activas</span>
          </div>
          <div className="student-class-grid">
            {classes.map((schoolClass, index) => (
              <article
                className={`student-class-card student-class-card-${index % 3}`}
                key={schoolClass.id}
              >
                <div className="student-class-image" />
                <div className="student-class-card-body">
                  <h3>{schoolClass.name}</h3>
                  <p>{schoolClass.description || 'Continúa con tu itinerario de aprendizaje'}</p>
                  <Badge variant="secondary">{schoolClass.level || 'Nivel inicial'}</Badge>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="student-progress-card">
          <div className="student-progress-copy">
            <p className="student-home-eyebrow">Tu progreso</p>
            <h2>Vas muy bien</h2>
            <p>Sigue practicando, estás en el camino correcto.</p>
          </div>
          <ProgressBar
            completed={completedCount}
            total={documents.length}
            label="Teoría completada"
          />
        </section>
      </div>
      <PaymentHistory studentId={studentId} title="Tus pagos" />
      <div className="student-documents-grid">
        <DocumentSection
          title="Para ti"
          description="Recursos seleccionados especialmente para tu aprendizaje."
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
          description="Material compartido por tus profesores."
          emptyTitle="No hay material de tus clases"
          emptyDescription="Cuando tu profesor comparta teoría con una clase aparecerá aquí."
          documents={classDocuments}
          onOpen={openDocument}
          onToggleCompleted={(documentId, isCompleted) =>
            completed.mutate({ documentId, studentId, completed: isCompleted })
          }
        />
      </div>
      <div className="student-home-quote">
        <Sparkles aria-hidden />
        <span>La disciplina de hoy es la libertad musical de mañana.</span>
      </div>
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
