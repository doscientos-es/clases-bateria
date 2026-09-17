import { createFileRoute } from '@tanstack/react-router'

import { AuthNoticePage } from '@/features/demo-auth'

export const Route = createFileRoute('/recuperar-contrasena')({
  component: () => (
    <AuthNoticePage
      title="Recuperación de contraseña simulada"
      description="La demo no envía correos ni gestiona contraseñas reales. Vuelve a la selección de identidad para continuar."
    />
  ),
})
