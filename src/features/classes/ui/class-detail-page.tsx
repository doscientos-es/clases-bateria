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
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderTitle,
  PageStack,
  Tabs,
  TabsContent,
  TabsList,
  TabsPanels,
  TabsTrigger,
} from '@doscientos/ui'
import { Link } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  MoreVertical,
  Plus,
  Send,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import { formatClassDate, formatClassTime } from '@/features/calendar/domain/calendar'
import {
  useDemoSnapshot,
  type ClassPathItem,
  type DocumentItem,
  type Student,
} from '@/features/demo-data'
import { ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'
import { PersonAvatar } from '@/shared/ui/person-avatar'

import {
  useAddStudentToClass,
  useClassDetail,
  useRemoveStudentFromClass,
} from '../application/class-hooks'
import {
  useAddDocumentToClassPath,
  useMoveClassDocument,
  useRemoveDocumentFromClassPath,
  useShareDocumentWithClass,
} from '../application/class-path-hooks'
import { ClassFormDialog } from './class-form-dialog'

export function ClassDetailPage({ classId }: { classId: string }) {
  const detail = useClassDetail(classId)
  const snapshot = useDemoSnapshot()
  const [editing, setEditing] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  if (detail.isPending) return <LoadingBlock label="Cargando clase…" />
  if (detail.isError) return <ErrorBlock onRetry={() => void detail.refetch()} />
  if (!detail.data) return <ErrorBlock description="No se ha encontrado la clase indicada." />
  const { schoolClass, teachers, students, path } = detail.data
  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>{schoolClass.name}</PageHeaderTitle>
          <PageHeaderDescription>
            {schoolClass.description || 'Clase de Aula Norte'}
          </PageHeaderDescription>
          <PageHeaderMeta>
            <Badge variant="secondary">{schoolClass.level || 'Sin nivel'}</Badge>
            <span className="text-muted-foreground text-sm">
              {students.length} alumnos ·{' '}
              {teachers.map((teacher) => teacher.name).join(', ') || 'Sin profesor'}
            </span>
          </PageHeaderMeta>
          <div className="class-schedule-callout">
            <strong>
              {schoolClass.scheduledAt
                ? formatClassDate(schoolClass.scheduledAt)
                : 'Sin fecha programada'}
            </strong>
            <span>
              {schoolClass.scheduledAt
                ? `A las ${formatClassTime(schoolClass.scheduledAt)}`
                : 'Edita la clase para añadir fecha y hora'}
            </span>
          </div>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button variant="outline" onPress={() => setPreviewing(true)}>
            <Eye aria-hidden /> Vista previa de la clase
          </Button>
          <Button variant="outline" onPress={() => setEditing(true)}>
            Editar clase
          </Button>
          <Link to="/clases" className="text-sm underline">
            Volver a clases
          </Link>
        </PageHeaderActions>
      </PageHeader>
      <Tabs className="space-y-4" defaultSelectedKey="path">
        <TabsList aria-label="Secciones de la clase">
          <TabsTrigger id="students">Alumnos</TabsTrigger>
          <TabsTrigger id="path">Itinerario</TabsTrigger>
        </TabsList>
        <TabsPanels>
          <TabsContent id="students">
            <StudentsPanel
              classId={classId}
              students={students}
              allStudents={snapshot.data?.students ?? []}
            />
          </TabsContent>
          <TabsContent id="path">
            <PathPanel
              classId={classId}
              path={path}
              students={students}
              documents={snapshot.data?.documents ?? []}
              isLoading={snapshot.isPending}
            />
          </TabsContent>
        </TabsPanels>
      </Tabs>
      <DialogRoot open={previewing} onOpenChange={setPreviewing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{schoolClass.name}</DialogTitle>
            <DialogDescription>
              Vista previa de la información que compone esta clase.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs font-medium uppercase">Nivel</p>
                <p className="mt-1 font-medium">{schoolClass.level || 'Sin nivel'}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs font-medium uppercase">Alumnos</p>
                <p className="mt-1 font-medium">{students.length}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Descripción</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {schoolClass.description || 'Esta clase todavía no tiene descripción.'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Profesores</h3>
              <div className="mt-2 space-y-2">
                {teachers.length ? (
                  teachers.map((teacher) => (
                    <div className="person-cell" key={teacher.id}>
                      <PersonAvatar person={teacher} size={30} />
                      <div>
                        <p className="text-sm font-medium">{teacher.name}</p>
                        <p className="text-muted-foreground text-xs">{teacher.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Sin profesores asignados.</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Alumnos</h3>
              <div className="mt-2 space-y-2">
                {students.length ? (
                  students.map((student) => (
                    <div className="person-cell" key={student.id}>
                      <PersonAvatar person={student} size={30} />
                      <p className="text-sm font-medium">{student.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Sin alumnos asignados.</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Itinerario</h3>
              {path.length ? (
                <ol className="mt-2 space-y-2">
                  {path.map((item, index) => (
                    <li className="flex items-center gap-2 text-sm" key={item.document.id}>
                      <span className="bg-secondary text-secondary-foreground grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="min-w-0 truncate">{item.document.title}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground mt-2 text-sm">
                  Aún no hay documentos en el itinerario.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onPress={() => setPreviewing(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      <ClassFormDialog schoolClass={schoolClass} isOpen={editing} onOpenChange={setEditing} />
    </PageStack>
  )
}

function StudentsPanel({
  classId,
  students,
  allStudents,
}: {
  classId: string
  students: Student[]
  allStudents: Student[]
}) {
  const add = useAddStudentToClass()
  const remove = useRemoveStudentFromClass()
  const available = allStudents.filter(
    (student) => student.status === 'active' && !students.some((item) => item.id === student.id),
  )
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Añade o retira alumnos de esta clase. Los cambios se reflejan al instante.
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {students.map((student) => (
          <div
            className="border-border flex items-center justify-between rounded-lg border p-3"
            key={student.id}
          >
            <div className="person-cell">
              <PersonAvatar person={student} size={32} />
              <div>
                <Link
                  className="font-medium underline"
                  to="/alumnos/$studentId"
                  params={{ studentId: student.id }}
                >
                  {student.name}
                </Link>
                <p className="text-muted-foreground text-xs">{student.email}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => remove.mutate({ classId, studentId: student.id })}
            >
              Retirar
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Alumnos disponibles</h2>
        {available.map((student) => (
          <Button
            key={student.id}
            size="sm"
            variant="outline"
            onPress={() => add.mutate({ classId, studentId: student.id })}
          >
            <PersonAvatar person={student} size={26} />
            Añadir {student.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

function PathPanel({
  classId,
  path,
  students,
  documents,
  isLoading,
}: {
  classId: string
  path: ClassPathItem[]
  students: Student[]
  documents: DocumentItem[]
  isLoading: boolean
}) {
  const add = useAddDocumentToClassPath()
  const remove = useRemoveDocumentFromClassPath()
  const move = useMoveClassDocument()
  const share = useShareDocumentWithClass()
  const included = new Set(path.map((item) => item.document.id))
  if (isLoading) return <LoadingBlock label="Cargando biblioteca…" />
  return (
    <div className="class-path-layout">
      <section className="class-path-library space-y-3">
        <div className="workspace-panel-heading">
          <div>
            <h2>Biblioteca</h2>
            <p>Busca y selecciona documentos para añadir a tu clase.</p>
          </div>
          <LibraryIcon />
        </div>
        <input
          className="workspace-search"
          aria-label="Buscar documentos"
          placeholder="Buscar documentos…"
        />
        <div className="workspace-filters">
          <span className="is-active">Todos</span>
          <span>Teoría</span>
          <span>Ejercicios</span>
        </div>
        <div className="workspace-document-list">
          {documents
            .filter((document) => document.status !== 'archived' && !included.has(document.id))
            .slice(0, 5)
            .map((document) => (
              <button
                className="workspace-document-row"
                key={document.id}
                onClick={() => add.mutate({ classId, documentId: document.id })}
              >
                <span className="workspace-document-icon">
                  <FileText aria-hidden />
                </span>
                <span>
                  <strong>{document.title}</strong>
                  <small>
                    {document.category} · {document.fileName}
                  </small>
                </span>
                <Plus aria-hidden />
              </button>
            ))}
        </div>
        <div className="workspace-share-box">
          <div className="workspace-panel-heading">
            <div>
              <h2>Compartir con</h2>
              <p>Alumnos de esta clase</p>
            </div>
            <Send aria-hidden />
          </div>
          <div className="workspace-recipient-list">
            {students.length ? (
              students.map((student) => (
                <span key={student.id}>
                  {student.name.split(' ')[0]} <MoreVertical aria-hidden />
                </span>
              ))
            ) : (
              <span>Ningún alumno asignado</span>
            )}
          </div>
          <Button className="w-full">
            <Send aria-hidden /> Compartir documentos
          </Button>
        </div>
      </section>
      <section className="class-path-timeline space-y-3">
        <div>
          <div className="workspace-panel-heading">
            <div>
              <h2>Itinerario</h2>
              <p>Organiza los materiales de tu clase en el orden que prefieras.</p>
            </div>
            <Button variant="outline">
              <Plus aria-hidden /> Añadir materiales
            </Button>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Ordena el contenido y compártelo con todos los alumnos cuando esté listo.
          </p>
        </div>
        {path.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aún no hay documentos en el itinerario.</p>
        ) : (
          <div className="itinerary-timeline">
            {path.map((item, index) => (
              <article
                className={`itinerary-item ${item.shared ? 'itinerary-item-shared' : ''}`}
                key={item.document.id}
              >
                <span className="itinerary-position" aria-hidden>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium">{item.document.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {item.document.category} · {item.document.level || 'Sin nivel'}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {item.shared ? 'Visible para la clase' : 'Pendiente de compartir'}
                  </p>
                </div>
                <div className="itinerary-item-actions">
                  <div className="share-check">
                    <Checkbox
                      aria-label={`Compartir ${item.document.title} con la clase`}
                      isSelected={item.shared}
                      onChange={(checked) =>
                        share.mutate({ classId, documentId: item.document.id, shared: checked })
                      }
                    >
                      Compartir
                    </Checkbox>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Mover ${item.document.title} arriba`}
                      onPress={() =>
                        move.mutate({ classId, documentId: item.document.id, direction: 'up' })
                      }
                      isDisabled={index === 0}
                    >
                      <ChevronUp aria-hidden />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Mover ${item.document.title} abajo`}
                      onPress={() =>
                        move.mutate({ classId, documentId: item.document.id, direction: 'down' })
                      }
                      isDisabled={index === path.length - 1}
                    >
                      <ChevronDown aria-hidden />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Quitar ${item.document.title} del itinerario`}
                      onPress={() => remove.mutate({ classId, documentId: item.document.id })}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function LibraryIcon() {
  return <FileText aria-hidden className="workspace-heading-icon" />
}
