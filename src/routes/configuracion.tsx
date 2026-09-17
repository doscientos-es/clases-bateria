import { createFileRoute } from '@tanstack/react-router'

import { ComingSoonPage } from '@/shared/ui/coming-soon-page'

export const Route = createFileRoute('/configuracion')({
  component: () => (
    <ComingSoonPage
      title="Configuración"
      description="Entrada reservada para los ajustes de la escuela."
    />
  ),
})
