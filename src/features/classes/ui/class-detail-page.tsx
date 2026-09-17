import {
  Badge,
  Button,
  Checkbox,
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
import { useState } from 'react'

import {
  useDemoSnapshot,
  type ClassPathItem,
  type DocumentItem,
  type Student,
} from '@/features/demo-data'
import { ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'

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
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button variant="outline" onPress={() => setEditing(true)}>
            Editar clase
          </Button>
          <Link to="/clases" className="text-sm underline">
            Volver a clases
          </Link>
        </PageHeaderActions>
      </PageHeader>
      <Tabs className="space-y-4" defaultSelectedKey="students">
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
              documents={snapshot.data?.documents ?? []}
              isLoading={snapshot.isPending}
            />
          </TabsContent>
        </TabsPanels>
      </Tabs>
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
        Añade o retira alumnos de esta clase. Los cambios se guardan localmente.
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {students.map((student) => (
          <div
            className="border-border flex items-center justify-between rounded-lg border p-3"
            key={student.id}
          >
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
  documents,
  isLoading,
}: {
  classId: string
  path: ClassPathItem[]
  documents: DocumentItem[]
  isLoading: boolean
}) {
  const add = useAddDocumentToClassPath()
  const remove = useRemoveDocumentFromClassPath()
  const move = useMoveClassDocument()
  const share = useShareDocumentWithClass()
  const [selected, setSelected] = useState('')
  const included = new Set(path.map((item) => item.document.id))
  if (isLoading) return <LoadingBlock label="Cargando biblioteca…" />
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Biblioteca disponible</h2>
        <select
          className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
          aria-label="Documento para añadir"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
        >
          <option value="">Selecciona un documento</option>
          {documents
            .filter((document) => document.status !== 'archived' && !included.has(document.id))
            .map((document) => (
              <option key={document.id} value={document.id}>
                {document.title}
              </option>
            ))}
        </select>
        <Button
          isDisabled={!selected || add.isPending}
          onPress={() => {
            add.mutate({ classId, documentId: selected })
            setSelected('')
          }}
        >
          Añadir al itinerario
        </Button>
      </section>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Timeline de la clase</h2>
        {path.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aún no hay documentos preparados.</p>
        ) : (
          path.map((item, index) => (
            <div
              className="border-border flex items-center gap-3 rounded-lg border p-3"
              key={item.document.id}
            >
              <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.document.title}</p>
                <p className="text-muted-foreground text-xs">
                  {item.document.category} ·{' '}
                  {item.shared ? 'Visible para la clase' : 'Privado / preparado'}
                </p>
              </div>
              <Checkbox
                aria-label={`Compartir ${item.document.title} con la clase`}
                isSelected={item.shared}
                onChange={(checked) =>
                  share.mutate({ classId, documentId: item.document.id, shared: checked })
                }
              >
                Compartir
              </Checkbox>
              <Button
                size="sm"
                variant="ghost"
                onPress={() =>
                  move.mutate({ classId, documentId: item.document.id, direction: 'up' })
                }
                isDisabled={index === 0}
              >
                ↑
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onPress={() =>
                  move.mutate({ classId, documentId: item.document.id, direction: 'down' })
                }
                isDisabled={index === path.length - 1}
              >
                ↓
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => remove.mutate({ classId, documentId: item.document.id })}
              >
                Quitar
              </Button>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
