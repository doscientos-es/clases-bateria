import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@doscientos/ui'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeftRight, ChevronUp, LogOut } from 'lucide-react'

import { useDemoSession, type DemoIdentity } from '@/features/demo-auth'
import { PersonAvatar } from '@/shared/ui/person-avatar'

/** Sticky account menu with the demo session actions. */
export function SessionActions({
  identity,
  onNavigate,
}: {
  identity: DemoIdentity
  onNavigate?: () => void
}) {
  const { signOut } = useDemoSession()
  const navigate = useNavigate()

  function leaveSession() {
    onNavigate?.()
    signOut()
    void navigate({ to: '/login' })
  }

  return (
    <DropdownMenu
      placement="top start"
      trigger={
        <Button
          className="session-user-trigger"
          variant="ghost"
          aria-label={`Abrir menú de ${identity.name}`}
        >
          <PersonAvatar person={identity} size={32} />
          <span className="session-user-copy">
            <strong>{identity.name}</strong>
            <small>{identity.email}</small>
          </span>
          <ChevronUp aria-hidden />
        </Button>
      }
    >
      <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onPress={leaveSession}>
        <ArrowLeftRight aria-hidden />
        Cambiar usuario
      </DropdownMenuItem>
      <DropdownMenuItem variant="destructive" onPress={leaveSession}>
        <LogOut aria-hidden />
        Cerrar sesión
      </DropdownMenuItem>
    </DropdownMenu>
  )
}
