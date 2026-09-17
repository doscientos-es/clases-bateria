import {
  Badge,
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PageStack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@doscientos/ui'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { type Teacher } from '@/features/demo-data'
import { EmptyBlock, ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'

import { useArchiveTeacher, useRestoreTeacher, useTeachers } from '../application/teacher-hooks'
import { TeacherFormDialog } from './teacher-form-dialog'

export function TeachersPage() {
  const teachers = useTeachers()
  const archive = useArchiveTeacher()
  const restore = useRestoreTeacher()
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [open, setOpen] = useState(false)
  function openForm(teacher: Teacher | null) {
    setEditing(teacher)
    setOpen(true)
  }
  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Profesores</PageHeaderTitle>
          <PageHeaderDescription>
            Personas responsables de las clases y sus itinerarios.
          </PageHeaderDescription>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button onPress={() => openForm(null)}>Añadir profesor</Button>
        </PageHeaderActions>
      </PageHeader>
      {teachers.isPending ? <LoadingBlock label="Cargando profesores…" /> : null}
      {teachers.isError ? <ErrorBlock onRetry={() => void teachers.refetch()} /> : null}
      {teachers.data?.length === 0 ? (
        <EmptyBlock
          title="Sin profesores"
          description="Añade el primer profesor de la escuela."
          action={<Button onPress={() => openForm(null)}>Añadir profesor</Button>}
        />
      ) : null}
      {teachers.data && teachers.data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profesor</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.data.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <Link
                    className="font-medium underline"
                    to="/profesores/$teacherId"
                    params={{ teacherId: teacher.id }}
                  >
                    {teacher.name}
                  </Link>
                  <span className="text-muted-foreground block text-xs">{teacher.email}</span>
                </TableCell>
                <TableCell>{teacher.specialty}</TableCell>
                <TableCell>
                  <Badge variant={teacher.status === 'active' ? 'secondary' : 'outline'}>
                    {teacher.status === 'active' ? 'Activo' : 'Archivado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onPress={() => openForm(teacher)}>
                      Editar
                    </Button>
                    {teacher.status === 'active' ? (
                      <Button size="sm" variant="ghost" onPress={() => archive.mutate(teacher.id)}>
                        Desactivar
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onPress={() => restore.mutate(teacher.id)}>
                        Reactivar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
      <TeacherFormDialog teacher={editing} isOpen={open} onOpenChange={setOpen} />
    </PageStack>
  )
}
