/** Current day as an ISO date, used as the registration date of new records. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Readable date for the interface. Empty values render as a dash. */
export function formatDate(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(date)
}
