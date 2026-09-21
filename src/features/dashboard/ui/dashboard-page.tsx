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
import { Link, useNavigate } from '@tanstack/react-router'
import ReactECharts from 'echarts-for-react'
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  Library,
  Music2,
  Sparkles,
  Users,
} from 'lucide-react'

import { useDemoSnapshot, type DemoData } from '@/features/demo-data'
import { ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'

import { dashboardSummary } from '../domain/summary'

export function DashboardPage() {
  const snapshot = useDemoSnapshot()
  const navigate = useNavigate()

  return (
    <PageStack>
      <section className="dashboard-welcome-panel">
        <div className="dashboard-welcome-content">
          <div className="dashboard-eyebrow">
            <Sparkles aria-hidden /> Tu estudio, en movimiento
          </div>
          <PageHeader>
            <PageHeaderHeading>
              <PageHeaderTitle>Resumen de la escuela</PageHeaderTitle>
              <PageHeaderDescription>
                {snapshot.data
                  ? `Actividad y próximos pasos de ${snapshot.data.school.name}.`
                  : 'Actividad y próximos pasos de tu escuela.'}
              </PageHeaderDescription>
            </PageHeaderHeading>
          </PageHeader>
        </div>
        <div className="dashboard-welcome-side">
          <span className="dashboard-welcome-note">Vista general</span>
          <div className="dashboard-welcome-art" aria-hidden>
            <span />
            <span />
            <span />
            <Music2 />
          </div>
        </div>
      </section>

      {snapshot.isPending ? <LoadingBlock /> : null}
      {snapshot.isError ? <ErrorBlock onRetry={() => void snapshot.refetch()} /> : null}

      {snapshot.data ? (
        <>
          <div className="dashboard-section-intro">
            <div>
              <span className="dashboard-section-kicker">El pulso de tu academia</span>
              <h2>Todo lo importante, a mano</h2>
            </div>
            <span className="dashboard-live-status">
              <i aria-hidden /> Actualizado ahora
            </span>
          </div>
          <DashboardMetrics data={snapshot.data} />
        </>
      ) : null}

      {snapshot.data ? (
        <>
          <div className="dashboard-command-grid">
            <section
              className="dashboard-panel dashboard-chart-panel"
              aria-labelledby="dashboard-instruments"
            >
              <div className="dashboard-panel-heading">
                <div>
                  <h2 id="dashboard-instruments">Alumnos por clase</h2>
                  <p>Distribución de las clases activas</p>
                </div>
                <span className="dashboard-panel-kicker">Ahora</span>
              </div>
              <StudentsByClassChart data={snapshot.data} />
            </section>
            <section className="dashboard-panel" aria-labelledby="dashboard-upcoming">
              <div className="dashboard-panel-heading">
                <div>
                  <h2 id="dashboard-upcoming">Próximas clases</h2>
                  <p>Tu agenda de hoy</p>
                </div>
                <CalendarDays aria-hidden />
              </div>
              <div className="dashboard-upcoming-list">
                <div className="dashboard-upcoming-item dashboard-upcoming-tone-coral">
                  <time>09:00</time>
                  <span>
                    <strong>Batería · Nivel inicial</strong>
                    <small>Aula 1 · Ana Martín</small>
                  </span>
                  <em>Hoy</em>
                </div>
                <div className="dashboard-upcoming-item dashboard-upcoming-tone-blue">
                  <time>11:30</time>
                  <span>
                    <strong>Ritmo y lectura · 1</strong>
                    <small>Aula 2 · Ana Martín</small>
                  </span>
                  <em>Hoy</em>
                </div>
                <div className="dashboard-upcoming-item dashboard-upcoming-tone-yellow">
                  <time>16:00</time>
                  <span>
                    <strong>Revisión de itinerario</strong>
                    <small>Biblioteca · Aula Norte</small>
                  </span>
                  <em>Hoy</em>
                </div>
              </div>
            </section>
            <section className="dashboard-panel" aria-labelledby="dashboard-library">
              <div className="dashboard-panel-heading">
                <div>
                  <h2 id="dashboard-library">Biblioteca de PDFs</h2>
                  <p>Material reciente</p>
                </div>
                <button
                  type="button"
                  className="text-primary text-sm font-semibold"
                  onClick={() => void navigate({ to: '/biblioteca' })}
                >
                  Ver todo
                </button>
              </div>
              <ul className="dashboard-doc-list">
                {snapshot.data.documents.slice(0, 4).map((document) => (
                  <li key={document.id}>
                    <FileText aria-hidden />
                    <span>
                      <strong>{document.title}</strong>
                      <small>{document.category} · PDF</small>
                    </span>
                    <ArrowUpRight aria-hidden />
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="dashboard-lower-grid">
            <section className="dashboard-panel space-y-4" aria-labelledby="dashboard-classes">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 id="dashboard-classes" className="text-lg font-semibold">
                    Mis clases
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Continúa preparando tus itinerarios.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-primary text-sm font-semibold"
                  onClick={() => void navigate({ to: '/clases' })}
                >
                  Ver todas <ArrowUpRight aria-hidden className="inline size-4" />
                </button>
              </div>
              <div className="dashboard-class-list">
                {snapshot.data.classes.slice(0, 3).map((schoolClass, index) => (
                  <Link
                    key={schoolClass.id}
                    to="/clases/$classId"
                    params={{ classId: schoolClass.id }}
                    className={`dashboard-class-row dashboard-class-tone-${(index % 3) + 1}`}
                  >
                    <span className="dashboard-class-mark" aria-hidden>
                      <BookOpen />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate">{schoolClass.name}</strong>
                      <small>
                        {schoolClass.level || 'Nivel inicial'} · {schoolClass.studentIds.length}{' '}
                        alumnos
                      </small>
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
          <div className="dashboard-bottom-grid">
            <section className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Progreso de alumnos</h2>
                  <p>Seguimiento por nivel</p>
                </div>
                <span className="text-primary text-sm font-semibold">Ver detalle</span>
              </div>
              <div className="dashboard-progress-list">
                <div>
                  <span>Iniciación</span>
                  <b>78%</b>
                  <i>
                    <em style={{ width: '78%' }} />
                  </i>
                </div>
                <div>
                  <span>Intermedio</span>
                  <b>62%</b>
                  <i>
                    <em style={{ width: '62%' }} />
                  </i>
                </div>
                <div>
                  <span>Avanzado</span>
                  <b>49%</b>
                  <i>
                    <em style={{ width: '49%' }} />
                  </i>
                </div>
              </div>
            </section>
            <section className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Actividad reciente</h2>
                  <p>Lo último que ha ocurrido</p>
                </div>
                <ArrowUpRight aria-hidden />
              </div>
              <ul className="dashboard-activity-list">
                <li>
                  <Users aria-hidden />
                  <span>
                    <strong>Lucía Ferrer se ha unido a Batería</strong>
                    <small>Hace 2 horas</small>
                  </span>
                </li>
                <li>
                  <FileText aria-hidden />
                  <span>
                    <strong>Se ha compartido un nuevo documento</strong>
                    <small>Hace 4 horas</small>
                  </span>
                </li>
                <li>
                  <CalendarDays aria-hidden />
                  <span>
                    <strong>Ana ha actualizado un itinerario</strong>
                    <small>Hace 6 horas</small>
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </>
      ) : null}

      <section className="dashboard-quick-actions" aria-label="Accesos directos">
        <div>
          <span className="dashboard-section-kicker">Siguiente compás</span>
          <h2>Accesos directos</h2>
          <p>Las acciones que más usas, sin buscar.</p>
        </div>
        <div className="dashboard-quick-action-list">
          <Button onPress={() => void navigate({ to: '/clases' })}>Ver clases</Button>
          <Button variant="outline" onPress={() => void navigate({ to: '/alumnos' })}>
            Gestionar alumnos
          </Button>
          <Button variant="outline" onPress={() => void navigate({ to: '/biblioteca' })}>
            Explorar documentos
          </Button>
        </div>
      </section>
    </PageStack>
  )
}

function StudentsByClassChart({ data }: { data: DemoData }) {
  const activeClasses = data.classes
    .filter((schoolClass) => schoolClass.status === 'active')
    .sort((a, b) => b.studentIds.length - a.studentIds.length)
  const topClasses = activeClasses.slice(0, 5)
  const otherStudents = activeClasses
    .slice(5)
    .reduce((total, schoolClass) => total + schoolClass.studentIds.length, 0)
  const classes = [
    ...topClasses.map((schoolClass) => ({
      id: schoolClass.id,
      name: schoolClass.name,
      studentCount: schoolClass.studentIds.length,
    })),
    ...(otherStudents
      ? [{ id: 'other-classes', name: 'Otras clases', studentCount: otherStudents }]
      : []),
  ]
  const palette = ['#d9826c', '#6e98ad', '#8da397', '#d8c8b4']
  const option = {
    animationDuration: 700,
    animationEasing: 'cubicOut',
    tooltip: { trigger: 'item', formatter: '{b}<br/><strong>{c} alumnos ({d}%)</strong>' },
    series: [
      {
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#fffaf5', borderWidth: 4 },
        label: { show: false },
        data: classes.map((schoolClass, index) => ({
          name: schoolClass.name,
          value: schoolClass.studentCount,
          itemStyle: { color: palette[index % palette.length] },
        })),
      },
    ],
  }

  return (
    <div className="dashboard-donut-row">
      <div className="dashboard-echart">
        <ReactECharts
          option={option}
          notMerge
          lazyUpdate
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'svg' }}
        />
        <div className="dashboard-echart-center">
          <strong>{dashboardSummary(data).activeStudents}</strong>
          <small>alumnos activos</small>
        </div>
      </div>
      <div className="dashboard-legend">
        {classes.map((schoolClass, index) => (
          <span key={schoolClass.id}>
            <i style={{ background: palette[index % palette.length] }} />
            {schoolClass.name} <b>{schoolClass.studentCount}</b>
          </span>
        ))}
      </div>
    </div>
  )
}

function DashboardMetrics({ data }: { data: DemoData }) {
  const summary = dashboardSummary(data)
  return (
    <MetricGrid columns={4} className="dashboard-metrics-grid">
      <MetricCard
        label="Alumnos activos"
        value={summary.activeStudents}
        icon={<Users aria-hidden />}
        tone="success"
        description="Personas aprendiendo"
      />
      <MetricCard
        label="Clases activas"
        value={summary.activeClasses}
        icon={<BookOpen aria-hidden />}
        tone="info"
        description="Itinerarios en marcha"
      />
      <MetricCard
        label="Documentos en biblioteca"
        value={summary.libraryDocuments}
        icon={<Library aria-hidden />}
        tone="warning"
        description="Material disponible"
      />
      <MetricCard
        label="Profesores"
        value={data.teachers.length}
        icon={<Users aria-hidden />}
        tone="danger"
        description="Equipo docente"
      />
    </MetricGrid>
  )
}
