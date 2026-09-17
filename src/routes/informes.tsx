import { createFileRoute } from '@tanstack/react-router'

import { ComingSoonPage } from '@/shared/ui/coming-soon-page'

export const Route = createFileRoute('/informes')({
  component: () => (
    <ComingSoonPage
      title="Informes"
      description="Entrada reservada para futuros informes de progreso."
    />
  ),
})
