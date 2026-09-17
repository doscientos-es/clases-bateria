import { Badge, Button, Card, CardContent } from '@doscientos/ui'

import type { VisibleDocument } from '@/features/demo-data'
import { EmptyBlock } from '@/shared/ui/data-state'

/** One visible document with the reason it is visible and its progress. */
export function StudentDocumentList({
  documents,
  emptyTitle,
  emptyDescription,
  onUnshare,
  isUnsharePending,
}: {
  documents: VisibleDocument[]
  emptyTitle: string
  emptyDescription: string
  onUnshare?: (documentId: string) => void
  isUnsharePending?: boolean
}) {
  if (documents.length === 0) {
    return <EmptyBlock title={emptyTitle} description={emptyDescription} />
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {documents.map((item) => (
        <li key={item.document.id}>
          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.document.title}</p>
                  <p className="text-muted-foreground text-sm">{item.document.description}</p>
                </div>
                <Badge variant="outline">{item.document.category}</Badge>
              </div>
              <p className="text-muted-foreground text-xs">{accessLabel(item)}</p>
              <p className="text-xs">{progressLabel(item)}</p>
              {onUnshare && item.source !== 'class' ? (
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={isUnsharePending ?? false}
                  onPress={() => onUnshare(item.document.id)}
                >
                  Retirar acceso directo
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}

function accessLabel(item: VisibleDocument): string {
  if (item.source === 'both') return 'Compartido contigo y con tu clase'
  if (item.source === 'direct') return 'Compartido directamente contigo'
  return 'Recibido a través de una clase'
}

function progressLabel(item: VisibleDocument): string {
  if (item.completed) return 'Completado'
  if (item.viewed) return 'Abierto, pendiente de completar'
  return 'Sin abrir'
}
