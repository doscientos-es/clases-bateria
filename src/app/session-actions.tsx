import { Badge, Button } from '@doscientos/ui'
import { useNavigate } from '@tanstack/react-router'
import { RefreshCw, UserRoundCog } from 'lucide-react'

import { useDemoSession, type DemoIdentity } from '@/features/demo-auth'
import { useDemoCommand, type DemoData } from '@/features/demo-data'

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
  const reset = useDemoCommand<void, DemoData>((repositories) => repositories.demoData.reset())

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
      <Button variant="ghost" onPress={() => reset.mutate()} isDisabled={reset.isPending}>
        <RefreshCw aria-hidden />
        {reset.isPending ? 'Restableciendo…' : 'Restablecer datos'}
      </Button>
      <Button variant="outline" onPress={changeUser}>
        <UserRoundCog aria-hidden />
        Cambiar usuario
      </Button>
    </div>
  )
}
