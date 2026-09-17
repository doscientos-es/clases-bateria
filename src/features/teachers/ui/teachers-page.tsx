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
import { useMemo, useState } from 'react'

import { type Teacher } from '@/features/demo-data'
import { EmptyBlock, ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'

import { useArchiveTeacher, useRestoreTeacher, useTeachers } from '../application/teacher-hooks'
import { filterAndSortTeachers, type TeacherSort } from '../domain/teacher-list'
import { TeacherFormDialog } from './teacher-form-dialog'

const statusFilters = [
  { id: 'all', label: 'Todos los estados' },
  { id: 'active', label: 'Activos' },
  { id: 'archived', label: 'Archivados' },
] as const

const sortOptions = [
  { id: 'name-asc', label: 'Nombre · A-Z' },
  { id: 'name-desc', label: 'Nombre · Z-A' },
  { id: 'specialty-asc', label: 'Especialidad · A-Z' },
  { id: 'status', label: 'Estado · Activos primero' },
] as const

export function TeachersPage() {
  const teachers = useTeachers()
  const archive = useArchiveTeacher()
  const restore = useRestoreTeacher()
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('all')
  const [status, setStatus] = useState<(typeof statusFilters)[number]['id']>('all')
  const [sort, setSort] = useState<TeacherSort>('name-asc')
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [open, setOpen] = useState(false)
  const specialties = useMemo(
    () =>
      [...new Set((teachers.data ?? []).map((teacher) => teacher.specialty).filter(Boolean))].sort(
        (left, right) => left.localeCompare(right, 'es'),
      ),
    [teachers.data],
  )
  const visibleTeachers = useMemo(
    () =>
      filterAndSortTeachers(teachers.data ?? [], {
        search,
        specialty,
        status,
        sort,
      }),
    [search, sort, specialty, status, teachers.data],
  )
  const filtersAreActive = Boolean(search.trim() || specialty !== 'all' || status !== 'all')

  function openForm(teacher: Teacher | null) {
    setEditing(teacher)
    setOpen(true)
  }

  function clearFilters() {
    setSearch('')
    setSpecialty('all')
    setStatus('all')
  }

  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Profesores</PageHeaderTitle>
          <PageHeaderDescription>
            Personas responsables de las clases y sus itinerarios. Busca, filtra y organiza el
            equipo de la escuela.
          </PageHeaderDescription>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button onPress={() => openForm(null)}>Añadir profesor</Button>
        </PageHeaderActions>
      </PageHeader>
      <div className="page-filter-bar">
        <Input
          aria-label="Buscar profesores"
          placeholder="Buscar por nombre o email"
          value={search}
          className="max-w-sm"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          aria-label="Filtrar por especialidad"
          selectedKey={specialty}
          onSelectionChange={(key) => setSpecialty(String(key))}
          className="w-56"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectList>
              <SelectItem id="all">Todas las especialidades</SelectItem>
              {specialties.map((item) => (
                <SelectItem key={item} id={item} textValue={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </Select>
        <Select
          aria-label="Filtrar por estado"
          selectedKey={status}
          onSelectionChange={(key) =>
            setStatus(String(key) as (typeof statusFilters)[number]['id'])
          }
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
        <Select
          aria-label="Ordenar profesores"
          selectedKey={sort}
          onSelectionChange={(key) => setSort(String(key) as TeacherSort)}
          className="w-52"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectList>
              {sortOptions.map((item) => (
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
      {teachers.data && teachers.data.length > 0 ? (
        <p className="text-muted-foreground text-sm">
          Mostrando {visibleTeachers.length} de {teachers.data.length} profesores
        </p>
      ) : null}
      {teachers.isPending ? <LoadingBlock label="Cargando profesores…" /> : null}
      {teachers.isError ? <ErrorBlock onRetry={() => void teachers.refetch()} /> : null}
      {teachers.data?.length === 0 ? (
        <EmptyBlock
          title="Sin profesores"
          description="Añade el primer profesor de la escuela."
          action={<Button onPress={() => openForm(null)}>Añadir profesor</Button>}
        />
      ) : null}
      {teachers.data && teachers.data.length > 0 && visibleTeachers.length === 0 ? (
        <EmptyBlock
          title="No hay profesores que coincidan"
          description="Prueba a cambiar la búsqueda o alguno de los filtros aplicados."
          action={
            <Button variant="outline" onPress={clearFilters}>
              Limpiar filtros
            </Button>
          }
        />
      ) : null}
      {visibleTeachers.length > 0 ? (
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
            {visibleTeachers.map((teacher) => (
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() => archive.mutate(teacher.id)}
                        isDisabled={archive.isPending}
                      >
                        Desactivar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() => restore.mutate(teacher.id)}
                        isDisabled={restore.isPending}
                      >
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
