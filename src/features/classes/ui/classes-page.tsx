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

import { EmptyBlock, ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'

import { useClasses } from '../application/class-hooks'
import { ClassFormDialog } from './class-form-dialog'

export function ClassesPage() {
  const classes = useClasses()
  const [open, setOpen] = useState(false)
  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Clases</PageHeaderTitle>
          <PageHeaderDescription>
            Grupos operativos con alumnos, profesores e itinerarios de teoría.
          </PageHeaderDescription>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button onPress={() => setOpen(true)}>Nueva clase</Button>
        </PageHeaderActions>
      </PageHeader>
      {classes.isPending ? <LoadingBlock label="Cargando clases…" /> : null}
      {classes.isError ? <ErrorBlock onRetry={() => void classes.refetch()} /> : null}
      {classes.data?.length === 0 ? (
        <EmptyBlock
          title="Sin clases"
          description="Crea la primera clase para empezar el recorrido."
          action={<Button onPress={() => setOpen(true)}>Nueva clase</Button>}
        />
      ) : null}
      {classes.data && classes.data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clase</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Alumnos</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.data.map((schoolClass) => (
              <TableRow key={schoolClass.id}>
                <TableCell>
                  <Link
                    className="font-medium underline"
                    to="/clases/$classId"
                    params={{ classId: schoolClass.id }}
                  >
                    {schoolClass.name}
                  </Link>
                  <span className="text-muted-foreground block text-xs">
                    {schoolClass.description || 'Sin descripción'}
                  </span>
                </TableCell>
                <TableCell>{schoolClass.level || '—'}</TableCell>
                <TableCell>{schoolClass.studentIds.length}</TableCell>
                <TableCell>
                  <Badge variant={schoolClass.status === 'active' ? 'secondary' : 'outline'}>
                    {schoolClass.status === 'active' ? 'Activa' : 'Archivada'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
      <ClassFormDialog schoolClass={null} isOpen={open} onOpenChange={setOpen} />
    </PageStack>
  )
}
