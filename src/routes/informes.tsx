import { createFileRoute } from '@tanstack/react-router'

import { ComingSoonPage } from '@/shared/ui/coming-soon-page'

export const Route = createFileRoute('/informes')({
  component: () => (
    <ComingSoonPage
      title="Informes"
      description="Todavía no hay informes de progreso disponibles."
    />
  ),
})
