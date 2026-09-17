import { createFileRoute } from '@tanstack/react-router'

import { ComingSoonPage } from '@/shared/ui/coming-soon-page'

export const Route = createFileRoute('/calendario')({
  component: () => (
    <ComingSoonPage
      title="Calendario"
      description="Entrada reservada para una futura planificación de clases."
    />
  ),
})
