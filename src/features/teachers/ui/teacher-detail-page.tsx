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

import { useDemoSnapshot } from '@/features/demo-data'
import { ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'
import { PersonAvatar } from '@/shared/ui/person-avatar'

import { useTeacher } from '../application/teacher-hooks'
import { TeacherFormDialog } from './teacher-form-dialog'

export function TeacherDetailPage({ teacherId }: { teacherId: string }) {
  const teacher = useTeacher(teacherId)
  const snapshot = useDemoSnapshot()
  const [editing, setEditing] = useState(false)
  if (teacher.isPending) return <LoadingBlock label="Cargando profesor…" />
  if (teacher.isError) return <ErrorBlock onRetry={() => void teacher.refetch()} />
  if (!teacher.data) return <ErrorBlock description="No se ha encontrado el profesor indicado." />
  const classes = (snapshot.data?.classes ?? []).filter((item) =>
    item.teacherIds.includes(teacherId),
  )
  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <div className="person-detail-heading">
            <PersonAvatar person={teacher.data} size={44} />
            <PageHeaderTitle>{teacher.data.name}</PageHeaderTitle>
          </div>
          <PageHeaderDescription>{teacher.data.email}</PageHeaderDescription>
          <PageHeaderMeta>
            <Badge variant={teacher.data.status === 'active' ? 'secondary' : 'outline'}>
              {teacher.data.status === 'active' ? 'Activo' : 'Archivado'}
            </Badge>
            <span className="text-muted-foreground text-sm">{teacher.data.specialty}</span>
          </PageHeaderMeta>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button variant="outline" onPress={() => setEditing(true)}>
            Editar profesor
          </Button>
          <Link to="/profesores" className="text-sm underline">
            Volver a profesores
          </Link>
        </PageHeaderActions>
      </PageHeader>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Clases asignadas</h2>
        {classes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tiene clases asignadas.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {classes.map((schoolClass) => (
              <li className="border-border rounded-lg border p-4" key={schoolClass.id}>
                <Link
                  className="font-medium underline"
                  to="/clases/$classId"
                  params={{ classId: schoolClass.id }}
                >
                  {schoolClass.name}
                </Link>
                <p className="text-muted-foreground mt-1 text-sm">
                  {schoolClass.studentIds.length} alumnos · {schoolClass.level || 'Sin nivel'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="border-border rounded-lg border p-4">
        <h2 className="text-sm font-semibold">Biblioteca y actividad</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Consulta el contenido de la escuela desde Biblioteca y organiza los materiales en cada
          itinerario.
        </p>
      </section>
      <TeacherFormDialog teacher={teacher.data} isOpen={editing} onOpenChange={setEditing} />
    </PageStack>
  )
}
