import {
  Badge,
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderTitle,
  PageStack,
} from '@doscientos/ui'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { useDemoSnapshot, useStudentLibrary } from '@/features/demo-data'
import { useUnshareDocumentWithStudent } from '@/features/documents'
import { formatDate } from '@/shared/lib/dates'
import { ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'
import { ProgressBar } from '@/shared/ui/progress-bar'

import { useStudent } from '../application/student-hooks'
import { ShareWithStudentDialog } from './share-with-student-dialog'
import { StudentDocumentList } from './student-documents'
import { StudentFormDialog } from './student-form-dialog'

export function StudentDetailPage({ studentId }: { studentId: string }) {
  const [isFormOpen, setFormOpen] = useState(false)
  const [isShareOpen, setShareOpen] = useState(false)
  const student = useStudent(studentId)
  const library = useStudentLibrary(studentId)
  const snapshot = useDemoSnapshot()
  const unshare = useUnshareDocumentWithStudent()

  if (student.isPending || library.isPending) return <LoadingBlock label="Cargando ficha…" />
  if (student.isError || library.isError) {
    return <ErrorBlock onRetry={() => void student.refetch()} />
  }
  if (!student.data) {
    return <ErrorBlock description="No se ha encontrado el alumno indicado." />
  }

  const documents = library.data ?? []
  const direct = documents.filter((item) => item.source !== 'class')
  const fromClasses = documents.filter((item) => item.source === 'class')
  const completed = documents.filter((item) => item.completed).length
  const classes = (snapshot.data?.classes ?? []).filter(
    (schoolClass) => schoolClass.status === 'active' && schoolClass.studentIds.includes(studentId),
  )

  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>{student.data.name}</PageHeaderTitle>
          <PageHeaderDescription>{student.data.email}</PageHeaderDescription>
          <PageHeaderMeta>
            <Badge variant={student.data.status === 'active' ? 'secondary' : 'outline'}>
              {student.data.status === 'active' ? 'Activo' : 'Archivado'}
            </Badge>
            <span className="text-muted-foreground text-sm">
              Alta: {formatDate(student.data.enrolledOn)}
            </span>
          </PageHeaderMeta>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button variant="outline" onPress={() => setFormOpen(true)}>
            Editar alumno
          </Button>
          <Link to="/biblioteca" className="text-sm underline">
            Ir a la biblioteca
          </Link>
        </PageHeaderActions>
      </PageHeader>

      <ProgressBar completed={completed} total={documents.length} label="Teoría completada" />

      <section className="space-y-2" aria-label="Clases del alumno">
        <h2 className="text-sm font-semibold">Clases</h2>
        {classes.length === 0 ? (
          <p className="text-muted-foreground text-sm">Todavía no pertenece a ninguna clase.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {classes.map((schoolClass) => (
              <li key={schoolClass.id}>
                <Link
                  to="/clases/$classId"
                  params={{ classId: schoolClass.id }}
                  className="text-sm underline"
                >
                  {schoolClass.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {student.data.notes ? (
        <section className="space-y-1" aria-label="Notas internas">
          <h2 className="text-sm font-semibold">Notas internas</h2>
          <p className="text-muted-foreground text-sm">{student.data.notes}</p>
        </section>
      ) : null}

      <section className="space-y-3" aria-label="Documentos compartidos directamente">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Para ti</h2>
          <Button size="sm" variant="outline" onPress={() => setShareOpen(true)}>
            Compartir documentos
          </Button>
        </div>
        <StudentDocumentList
          documents={direct}
          emptyTitle="Sin envíos individuales"
          emptyDescription="Comparte documentos concretos desde la biblioteca o con el botón anterior."
          onUnshare={(documentId) => unshare.mutate({ documentId, studentId })}
          isUnsharePending={unshare.isPending}
        />
      </section>

      <section className="space-y-3" aria-label="Documentos recibidos de sus clases">
        <h2 className="text-sm font-semibold">De tus clases</h2>
        <StudentDocumentList
          documents={fromClasses}
          emptyTitle="Sin documentos heredados"
          emptyDescription="Activa el check de compartir en el itinerario de una clase."
        />
      </section>

      <StudentFormDialog student={student.data} isOpen={isFormOpen} onOpenChange={setFormOpen} />
      <ShareWithStudentDialog
        studentId={studentId}
        studentName={student.data.name}
        isOpen={isShareOpen}
        onOpenChange={setShareOpen}
      />
    </PageStack>
  )
}
