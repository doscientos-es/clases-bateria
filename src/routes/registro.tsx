import { createFileRoute } from '@tanstack/react-router'

import { AuthNoticePage } from '@/features/demo-auth'

export const Route = createFileRoute('/registro')({
  component: () => (
    <AuthNoticePage
      title="Registro no disponible en la demo"
      description="Esta demo funciona con identidades preparadas. No se crean cuentas ni se envían datos a ningún servidor."
    />
  ),
})
