import { Badge, Button } from '@doscientos/ui'
import { useNavigate } from '@tanstack/react-router'
import { UserRoundCog } from 'lucide-react'

import { useDemoSession, type DemoIdentity } from '@/features/demo-auth'

/** Identity summary plus the two actions that must always be reachable. */
export function SessionActions({
  identity,
  onNavigate,
}: {
  identity: DemoIdentity
  onNavigate?: () => void
}) {
  const { signOut } = useDemoSession()
  const navigate = useNavigate()

  function changeUser() {
    onNavigate?.()
    signOut()
    void navigate({ to: '/login' })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="hidden text-sm font-medium sm:inline">{identity.name}</span>
      <Badge variant={identity.role === 'teacher' ? 'secondary' : 'outline'}>
        {identity.role === 'teacher' ? 'Profesor' : 'Alumno'}
      </Badge>
      <Button variant="outline" onPress={changeUser}>
        <UserRoundCog aria-hidden />
        Cambiar usuario
      </Button>
    </div>
  )
}
