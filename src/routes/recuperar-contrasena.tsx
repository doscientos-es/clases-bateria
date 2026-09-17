import { createFileRoute } from '@tanstack/react-router'

import { AuthNoticePage } from '@/features/demo-auth'

export const Route = createFileRoute('/recuperar-contrasena')({
  component: () => (
    <AuthNoticePage
      title="Recupera tu contraseña"
      description="Solicita un enlace de recuperación al administrador de la escuela para volver a acceder a tu cuenta."
    />
  ),
})
