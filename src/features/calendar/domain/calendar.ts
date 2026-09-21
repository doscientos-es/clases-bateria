export type CalendarCell = {
  date: string
  day: number
  isCurrentMonth: boolean
}

export function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function scheduledDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function scheduledDateKey(value: string | null | undefined): string | null {
  const date = scheduledDate(value)
  return date ? dateKey(date) : null
}

export function monthCells(month: Date): CalendarCell[] {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1)
  const firstMondayOffset = (firstDay.getDay() + 6) % 7
  const cells: CalendarCell[] = []

  for (let index = 0; index < 42; index += 1) {
    const cellDate = new Date(year, monthIndex, index - firstMondayOffset + 1)
    cells.push({
      date: dateKey(cellDate),
      day: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === monthIndex,
    })
  }
  return cells
}

export function formatMonth(month: Date): string {
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(month)
}

export function formatClassDate(value: string): string {
  const date = scheduledDate(value)
  if (!date) return 'Fecha no válida'
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function formatClassTime(value: string): string {
  const date = scheduledDate(value)
  if (!date) return '--:--'
  return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date)
}
