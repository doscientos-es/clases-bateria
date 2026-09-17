import {
  Button,
  MetricCard,
  MetricGrid,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PageStack,
} from '@doscientos/ui'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, Library, Users } from 'lucide-react'

import { useDemoSnapshot, type DemoData } from '@/features/demo-data'
import { ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'

import { dashboardSummary } from '../domain/summary'

export function DashboardPage() {
  const snapshot = useDemoSnapshot()
  const navigate = useNavigate()

  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Inicio</PageHeaderTitle>
          <PageHeaderDescription>
            {snapshot.data
              ? `Estado actual de ${snapshot.data.school.name}.`
              : 'Estado actual de la escuela.'}
          </PageHeaderDescription>
        </PageHeaderHeading>
      </PageHeader>

      {snapshot.isPending ? <LoadingBlock /> : null}
      {snapshot.isError ? <ErrorBlock onRetry={() => void snapshot.refetch()} /> : null}

      {snapshot.data ? <DashboardMetrics data={snapshot.data} /> : null}

      <section className="space-y-3" aria-label="Accesos directos">
        <h2 className="text-sm font-semibold">Accesos directos</h2>
        <div className="flex flex-wrap gap-2">
          <Button onPress={() => void navigate({ to: '/clases' })}>Nueva clase</Button>
          <Button variant="outline" onPress={() => void navigate({ to: '/alumnos' })}>
            Añadir alumno
          </Button>
          <Button variant="outline" onPress={() => void navigate({ to: '/biblioteca' })}>
            Explorar documentos
          </Button>
        </div>
      </section>
    </PageStack>
  )
}

function DashboardMetrics({ data }: { data: DemoData }) {
  const summary = dashboardSummary(data)
  return (
    <MetricGrid columns={3}>
      <MetricCard
        label="Alumnos activos"
        value={summary.activeStudents}
        icon={<Users aria-hidden />}
      />
      <MetricCard
        label="Clases activas"
        value={summary.activeClasses}
        icon={<BookOpen aria-hidden />}
      />
      <MetricCard
        label="Documentos en biblioteca"
        value={summary.libraryDocuments}
        icon={<Library aria-hidden />}
      />
    </MetricGrid>
  )
}
