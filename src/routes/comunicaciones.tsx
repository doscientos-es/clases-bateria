import { createFileRoute } from '@tanstack/react-router'

import { ComingSoonPage } from '@/shared/ui/coming-soon-page'

export const Route = createFileRoute('/comunicaciones')({ component: CommunicationsRoute })

function CommunicationsRoute() {
  return (
    <ComingSoonPage
      title="Comunicaciones"
      description="Un espacio para estar en contacto con tus profesores y la escuela."
    />
  )
}
