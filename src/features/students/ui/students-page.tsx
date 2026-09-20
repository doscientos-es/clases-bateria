import {
  Badge,
  Button,
  Input,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PageStack,
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@doscientos/ui'
import { Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { useState } from 'react'

import {
  buildStudentLibrary,
  useDemoSnapshot,
  type DemoData,
  type EntityStatus,
  type Student,
} from '@/features/demo-data'
import { EmptyBlock, ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'
import { PersonAvatar } from '@/shared/ui/person-avatar'

import { useArchiveStudent, useRestoreStudent, useStudents } from '../application/student-hooks'
import { ShareWithStudentDialog } from './share-with-student-dialog'
import { StudentFormDialog } from './student-form-dialog'

const statusFilters = [
  { id: 'all', label: 'Todos los estados' },
  { id: 'active', label: 'Activos' },
  { id: 'archived', label: 'Archivados' },
] as const

export function StudentsPage() {
  const [search, setSearch] = useState('')
  const [classId, setClassId] = useState('all')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState<Student | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [documentsStudent, setDocumentsStudent] = useState<Student | null>(null)

  const snapshot = useDemoSnapshot()
  const students = useStudents({
    search,
    classId: classId === 'all' ? undefined : classId,
    status: status === 'all' ? undefined : (status as EntityStatus),
  })
  const archive = useArchiveStudent()
  const restore = useRestoreStudent()
  const filtersAreActive = Boolean(search.trim() || classId !== 'all' || status !== 'all')

  function openForm(student: Student | null) {
    setEditing(student)
    setFormOpen(true)
  }

  function clearFilters() {
    setSearch('')
    setClassId('all')
    setStatus('all')
  }

  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Alumnos</PageHeaderTitle>
          <PageHeaderDescription>
            Listado con búsqueda, filtros por clase y estado, y baja lógica.
          </PageHeaderDescription>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button onPress={() => openForm(null)}>Añadir alumno</Button>
        </PageHeaderActions>
      </PageHeader>

      <div className="page-filter-bar">
        <Input
          aria-label="Buscar alumnos"
          placeholder="Buscar por nombre o email"
          value={search}
          className="max-w-xs"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          aria-label="Filtrar por clase"
          selectedKey={classId}
          onSelectionChange={(key) => setClassId(String(key))}
          className="w-56"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectList>
              <SelectItem id="all">Todas las clases</SelectItem>
              {(snapshot.data?.classes ?? []).map((schoolClass) => (
                <SelectItem key={schoolClass.id} id={schoolClass.id} textValue={schoolClass.name}>
                  {schoolClass.name}
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </Select>
        <Select
          aria-label="Filtrar por estado"
          selectedKey={status}
          onSelectionChange={(key) => setStatus(String(key))}
          className="w-48"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectList>
              {statusFilters.map((item) => (
                <SelectItem key={item.id} id={item.id} textValue={item.label}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </Select>
        {filtersAreActive ? (
          <Button variant="ghost" onPress={clearFilters}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {students.data ? (
        <p className="page-filter-summary">
          Mostrando {students.data.length} alumno{students.data.length === 1 ? '' : 's'}
        </p>
      ) : null}

      {students.isPending ? <LoadingBlock label="Cargando alumnos…" /> : null}
      {students.isError ? <ErrorBlock onRetry={() => void students.refetch()} /> : null}
      {students.data?.length === 0 ? (
        <EmptyBlock
          title="Sin alumnos que mostrar"
          description="Ajusta la búsqueda o los filtros, o añade un alumno nuevo."
          action={<Button onPress={() => openForm(null)}>Añadir alumno</Button>}
        />
      ) : null}

      {students.data && students.data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alumno</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Documentos compartidos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.data.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="person-cell">
                    <PersonAvatar person={student} />
                    <div>
                      <Link to="/alumnos/$studentId" params={{ studentId: student.id }}>
                        {student.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{student.email}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label={`Ver documentos compartidos de ${student.name}`}
                    onPress={() => setDocumentsStudent(student)}
                  >
                    <FileText aria-hidden />
                    {studentDocumentLabel(snapshot.data, student.id)}
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge variant={student.status === 'active' ? 'secondary' : 'outline'}>
                    {student.status === 'active' ? 'Activo' : 'Archivado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onPress={() => openForm(student)}>
                      Editar
                    </Button>
                    {student.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() => archive.mutate(student.id)}
                        isDisabled={archive.isPending}
                      >
                        Archivar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() => restore.mutate(student.id)}
                        isDisabled={restore.isPending}
                      >
                        Restaurar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}

      <StudentFormDialog student={editing} isOpen={isFormOpen} onOpenChange={setFormOpen} />
      <ShareWithStudentDialog
        studentId={documentsStudent?.id ?? ''}
        studentName={documentsStudent?.name ?? ''}
        isOpen={Boolean(documentsStudent)}
        onOpenChange={(open) => {
          if (!open) setDocumentsStudent(null)
        }}
      />
    </PageStack>
  )
}

function studentDocumentLabel(data: DemoData | undefined, studentId: string): string {
  const count = data ? buildStudentLibrary(data, studentId).length : 0
  return `${count} documento${count === 1 ? '' : 's'} compartido${count === 1 ? '' : 's'}`
}
