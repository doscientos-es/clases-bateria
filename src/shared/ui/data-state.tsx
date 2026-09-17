import {
  Button,
  DataViewState,
  DataViewStateActions,
  DataViewStateDescription,
  DataViewStateTitle,
  Spinner,
} from '@doscientos/ui'
import type { ReactNode } from 'react'

/** Initial load of a screen or of one of its sections. */
export function LoadingBlock({ label = 'Cargando datos…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10" role="status">
      <Spinner />
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  )
}

/** Recoverable error with an explicit retry. */
export function ErrorBlock({
  description = 'No se han podido cargar los datos de la demo.',
  onRetry,
}: {
  description?: string
  onRetry?: () => void
}) {
  return (
    <DataViewState role="alert">
      <DataViewStateTitle>Algo no ha ido bien</DataViewStateTitle>
      <DataViewStateDescription>{description}</DataViewStateDescription>
      {onRetry ? (
        <DataViewStateActions>
          <Button variant="outline" onPress={onRetry}>
            Reintentar
          </Button>
        </DataViewStateActions>
      ) : null}
    </DataViewState>
  )
}

/** Empty result, always explained with text and never only with color. */
export function EmptyBlock({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <DataViewState>
      <DataViewStateTitle>{title}</DataViewStateTitle>
      <DataViewStateDescription>{description}</DataViewStateDescription>
      {action ? <DataViewStateActions>{action}</DataViewStateActions> : null}
    </DataViewState>
  )
}
