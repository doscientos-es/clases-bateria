import {
  AppShell,
  AppShellContent,
  AppShellHeader,
  AppShellMain,
  AppShellMobileHeader,
  AppShellSidebar,
  Drawer,
} from '@doscientos/ui'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import { useDemoSession } from '@/features/demo-auth'
import { useDemoSnapshot } from '@/features/demo-data'

import { PrimaryNavigation } from './app-navigation'
import { SessionActions } from './session-actions'

const authRoutes = ['/login', '/registro', '/recuperar-contrasena']

function BrandMark({ name, onNavigate }: { name: string; onNavigate?: () => void }) {
  return (
    <Link to="/" className="brand-mark" onClick={onNavigate}>
      <span className="flex flex-col gap-0.5">
        <strong>{name}</strong>
        <small>Gestión de clases</small>
      </span>
    </Link>
  )
}

/** Sends every visitor to the surface their role is allowed to use. */
function useRoleGuard(pathname: string, isAuthRoute: boolean) {
  const { identity, ready } = useDemoSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!ready || isAuthRoute) return
    if (!identity) {
      void navigate({ to: '/login', replace: true })
      return
    }
    const studentPlaceholderRoutes = ['/comunicaciones', '/calendario', '/configuracion']
    if (
      identity.role === 'student' &&
      pathname !== '/alumno' &&
      !studentPlaceholderRoutes.includes(pathname)
    ) {
      void navigate({ to: '/alumno', replace: true })
      return
    }
    if (identity.role === 'teacher' && pathname === '/alumno') {
      void navigate({ to: '/', replace: true })
    }
  }, [identity, isAuthRoute, navigate, pathname, ready])

  return { identity, ready }
}

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isAuthRoute = authRoutes.includes(pathname)
  const { identity, ready } = useRoleGuard(pathname, isAuthRoute)
  const snapshot = useDemoSnapshot()
  const [navigationOpen, setNavigationOpen] = useState(false)

  if (isAuthRoute) return <>{children}</>

  if (!ready || !identity) {
    return (
      <div
        className="text-muted-foreground flex min-h-svh items-center justify-center text-sm"
        role="status"
      >
        Preparando tu espacio…
      </div>
    )
  }

  const schoolName = snapshot.data?.school.name ?? 'Aula'

  return (
    <AppShell sidebarBreakpoint="lg" className="bg-muted/35 h-svh overflow-hidden">
      <AppShellSidebar aria-label="Navegación de escritorio">
        <div className="app-sidebar-header">
          <BrandMark name={schoolName} />
        </div>
        <nav aria-label="Navegación principal" className="app-sidebar-navigation">
          <PrimaryNavigation role={identity.role} />
        </nav>
      </AppShellSidebar>
      <AppShellMain>
        <AppShellMobileHeader className="justify-between">
          <button
            type="button"
            className="mobile-menu-trigger"
            aria-label="Abrir menú"
            aria-expanded={navigationOpen}
            onClick={() => setNavigationOpen(true)}
          >
            <Menu aria-hidden />
          </button>
          <Drawer
            isOpen={navigationOpen}
            onOpenChange={setNavigationOpen}
            side="left"
            className="w-72! max-w-[85vw]!"
            showCloseButton={false}
            dialogProps={{ 'aria-label': 'Navegación principal' }}
          >
            <div className="flex h-full flex-col">
              <div className="border-border flex items-center justify-between border-b px-5 py-5">
                <BrandMark name={schoolName} onNavigate={() => setNavigationOpen(false)} />
                <button
                  type="button"
                  className="mobile-menu-trigger"
                  aria-label="Cerrar menú"
                  onClick={() => setNavigationOpen(false)}
                >
                  <X aria-hidden />
                </button>
              </div>
              <nav
                aria-label="Navegación principal"
                className="min-h-0 flex-1 overflow-y-auto px-3 py-3"
              >
                <PrimaryNavigation
                  role={identity.role}
                  onNavigate={() => setNavigationOpen(false)}
                />
              </nav>
              <div className="border-border border-t p-3">
                <SessionActions identity={identity} onNavigate={() => setNavigationOpen(false)} />
              </div>
            </div>
          </Drawer>
          <BrandMark name={schoolName} />
          <span className="text-muted-foreground text-xs">{identity.name}</span>
        </AppShellMobileHeader>
        <AppShellHeader className="desktop-app-header h-14 shrink-0 justify-between px-6 lg:px-8">
          <span className="text-muted-foreground text-sm font-medium">
            {identity.role === 'teacher' ? 'Backoffice' : 'Portal del alumno'}
          </span>
          <SessionActions identity={identity} />
        </AppShellHeader>
        <AppShellContent className="mx-auto flex min-h-0 w-full max-w-[100rem] flex-1 flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  )
}
