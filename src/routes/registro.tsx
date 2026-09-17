import { createFileRoute } from '@tanstack/react-router'

import { AuthNoticePage } from '@/features/demo-auth'

export const Route = createFileRoute('/registro')({
  component: () => (
    <AuthNoticePage
      title="Crea tu cuenta"
      description="El registro de nuevas cuentas lo gestiona el administrador de la escuela. Contacta con tu centro para recibir acceso."
    />
  ),
})
