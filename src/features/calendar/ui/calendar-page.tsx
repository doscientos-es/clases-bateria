import {
  Button,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PageStack,
} from '@doscientos/ui'
import { Link } from '@tanstack/react-router'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useDemoSession } from '@/features/demo-auth'
import { useDemoSnapshot, type SchoolClass } from '@/features/demo-data'
import { ErrorBlock, LoadingBlock } from '@/shared/ui/data-state'

import {
  dateKey,
  formatClassDate,
  formatClassTime,
  formatMonth,
  monthCells,
  scheduledDate,
  scheduledDateKey,
} from '../domain/calendar'

export function CalendarPage() {
  const { identity } = useDemoSession()
  const snapshot = useDemoSnapshot()
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  )
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()))

  if (snapshot.isPending) return <LoadingBlock label="Cargando calendario…" />
  if (snapshot.isError || !snapshot.data)
    return <ErrorBlock onRetry={() => void snapshot.refetch()} />

  const classes = snapshot.data.classes.filter((schoolClass) => {
    if (schoolClass.status !== 'active' || !schoolClass.scheduledAt) return false
    return identity?.role === 'teacher'
      ? schoolClass.teacherIds.includes(identity.id)
      : schoolClass.studentIds.includes(identity?.id ?? '')
  })
  const classesByDate = groupByDate(classes)
  const cells = monthCells(month)
  const selectedClasses = classesByDate.get(selectedDate) ?? []
  const upcoming = classes
    .filter((schoolClass) => {
      const date = scheduledDate(schoolClass.scheduledAt)
      return date ? date.getTime() >= Date.now() : false
    })
    .sort((a, b) => scheduledTime(a) - scheduledTime(b))

  function moveMonth(offset: number) {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + offset, 1)
    setMonth(nextMonth)
    setSelectedDate(dateKey(nextMonth))
  }

  return (
    <PageStack>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Calendario</PageHeaderTitle>
          <PageHeaderDescription>
            {identity?.role === 'teacher'
              ? 'Organiza tus clases y consulta de un vistazo tu agenda.'
              : 'Consulta las próximas clases que tienes con tus profesores.'}
          </PageHeaderDescription>
        </PageHeaderHeading>
      </PageHeader>

      <div className="calendar-layout">
        <section className="calendar-panel" aria-label="Calendario mensual">
          <div className="calendar-toolbar">
            <div>
              <p className="calendar-eyebrow">Agenda mensual</p>
              <h2>{capitalize(formatMonth(month))}</h2>
            </div>
            <div className="calendar-toolbar-actions">
              <Button
                variant="outline"
                size="sm"
                aria-label="Mes anterior"
                onPress={() => moveMonth(-1)}
              >
                <ChevronLeft aria-hidden />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => {
                  const today = new Date()
                  setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
                  setSelectedDate(dateKey(today))
                }}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-label="Mes siguiente"
                onPress={() => moveMonth(1)}
              >
                <ChevronRight aria-hidden />
              </Button>
            </div>
          </div>
          <div className="calendar-weekdays" aria-hidden>
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {cells.map((cell) => {
              const dayClasses = classesByDate.get(cell.date) ?? []
              const selected = cell.date === selectedDate
              return (
                <button
                  className={`calendar-day ${cell.isCurrentMonth ? '' : 'calendar-day-muted'} ${selected ? 'calendar-day-selected' : ''}`}
                  key={cell.date}
                  type="button"
                  aria-label={`${cell.date}${dayClasses.length ? `, ${dayClasses.length} clases` : ''}`}
                  aria-pressed={selected}
                  onClick={() => setSelectedDate(cell.date)}
                >
                  <span className="calendar-day-number">{cell.day}</span>
                  {dayClasses.length ? (
                    <span className="calendar-day-events">
                      {dayClasses.slice(0, 3).map((schoolClass) => (
                        <i key={schoolClass.id} />
                      ))}
                    </span>
                  ) : null}
                  {dayClasses.length > 1 ? <small>{dayClasses.length}</small> : null}
                </button>
              )
            })}
          </div>
          <div className="calendar-legend">
            <span>
              <i /> Clase programada
            </span>
            <span>
              {classes.length} {classes.length === 1 ? 'clase visible' : 'clases visibles'}
            </span>
          </div>
        </section>

        <aside className="calendar-side-column">
          <section className="calendar-panel calendar-selected-panel" aria-live="polite">
            <div className="calendar-section-heading">
              <div>
                <p className="calendar-eyebrow">Día seleccionado</p>
                <h2>{formatSelectedDate(selectedDate)}</h2>
              </div>
              <CalendarDays aria-hidden />
            </div>
            {selectedClasses.length ? (
              <div className="calendar-event-list">
                {selectedClasses.map((schoolClass) => (
                  <CalendarEvent
                    key={schoolClass.id}
                    schoolClass={schoolClass}
                    role={identity?.role}
                  />
                ))}
              </div>
            ) : (
              <p className="calendar-empty">No hay clases programadas para este día.</p>
            )}
          </section>
          <section className="calendar-panel" aria-labelledby="upcoming-classes">
            <div className="calendar-section-heading">
              <div>
                <p className="calendar-eyebrow">Lo siguiente</p>
                <h2 id="upcoming-classes">Próximas clases</h2>
              </div>
              <Clock3 aria-hidden />
            </div>
            {upcoming.length ? (
              <div className="calendar-upcoming-list">
                {upcoming.slice(0, 4).map((schoolClass) => (
                  <button
                    key={schoolClass.id}
                    type="button"
                    onClick={() => {
                      const date = scheduledDate(schoolClass.scheduledAt)
                      if (!date) return
                      setMonth(new Date(date.getFullYear(), date.getMonth(), 1))
                      setSelectedDate(dateKey(date))
                    }}
                  >
                    <time>{formatClassTime(schoolClass.scheduledAt ?? '')}</time>
                    <span>
                      <strong>{schoolClass.name}</strong>
                      <small>{formatClassDate(schoolClass.scheduledAt ?? '')}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="calendar-empty">
                {identity?.role === 'teacher'
                  ? 'Edita una clase para añadir su próxima fecha.'
                  : 'Todavía no tienes clases programadas.'}
              </p>
            )}
            {identity?.role === 'teacher' ? (
              <Link className="calendar-side-link" to="/clases">
                Gestionar mis clases
              </Link>
            ) : null}
          </section>
        </aside>
      </div>
    </PageStack>
  )
}

function CalendarEvent({
  schoolClass,
  role,
}: {
  schoolClass: SchoolClass
  role: 'teacher' | 'student' | undefined
}) {
  return (
    <article className="calendar-event-card">
      <div className="calendar-event-time">{formatClassTime(schoolClass.scheduledAt ?? '')}</div>
      <div className="min-w-0 flex-1">
        {role === 'teacher' ? (
          <Link
            className="calendar-event-title"
            to="/clases/$classId"
            params={{ classId: schoolClass.id }}
          >
            {schoolClass.name}
          </Link>
        ) : (
          <strong className="calendar-event-title">{schoolClass.name}</strong>
        )}
        <p>
          {role === 'teacher'
            ? `${schoolClass.studentIds.length} alumnos`
            : 'Clase con tu profesor'}
        </p>
      </div>
      <UsersRound aria-hidden />
    </article>
  )
}

function scheduledTime(schoolClass: SchoolClass): number {
  return scheduledDate(schoolClass.scheduledAt)?.getTime() ?? 0
}

function groupByDate(classes: SchoolClass[]): Map<string, SchoolClass[]> {
  const grouped = new Map<string, SchoolClass[]>()
  for (const schoolClass of classes) {
    const key = scheduledDateKey(schoolClass.scheduledAt)
    if (!key) continue
    grouped.set(key, [...(grouped.get(key) ?? []), schoolClass])
  }
  return grouped
}

function formatSelectedDate(value: string): string {
  const date = new Date(`${value}T12:00`)
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
