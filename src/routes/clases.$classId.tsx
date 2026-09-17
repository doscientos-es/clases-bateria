import { createFileRoute } from '@tanstack/react-router'

import { ClassDetailPage } from '@/features/classes'

function ClassDetailRoute() {
  return <ClassDetailPage classId={Route.useParams().classId} />
}

export const Route = createFileRoute('/clases/$classId')({ component: ClassDetailRoute })
