/** Completed ratio of a document set, described with text and with a bar. */
export function ProgressBar({
  completed,
  total,
  label,
}: {
  completed: number
  total: number
  label: string
}) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">
          {completed} de {total} · {percent}%
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="progress-value" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
