import {
  Badge,
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PageStack,
} from '@doscientos/ui'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, BookOpen, UsersRound } from 'lucide-react'
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
        <div className="class-card-grid">
          {classes.data.map((schoolClass, index) => (
            <Link
              key={schoolClass.id}
              to="/clases/$classId"
              params={{ classId: schoolClass.id }}
              className={`class-card class-card-tone-${(index % 4) + 1}`}
            >
              <div className="class-card-art" aria-hidden>
                <BookOpen />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="class-card-body">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                      {schoolClass.level || 'Nivel inicial'}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{schoolClass.name}</h2>
                  </div>
                  <ArrowUpRight aria-hidden className="text-primary size-5 shrink-0" />
                </div>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                  {schoolClass.description || 'Itinerario de aprendizaje y materiales.'}
                </p>
                <div className="class-card-meta mt-5">
                  <span><UsersRound aria-hidden /> {schoolClass.studentIds.length} alumnos</span>
                  <Badge variant={schoolClass.status === 'active' ? 'secondary' : 'outline'}>
                    {schoolClass.status === 'active' ? 'Activa' : 'Archivada'}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
      <ClassFormDialog schoolClass={null} isOpen={open} onOpenChange={setOpen} />
    </PageStack>
  )
}
