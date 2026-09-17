import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  CalendarDays,
  ChartNoAxesColumn,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageCircle,
  Settings,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'

import type { DemoRole } from '@/features/demo-auth'

/** Routes reachable from the shell navigation. */
type AppRoute =
  | '/'
  | '/alumnos'
  | '/profesores'
  | '/clases'
  | '/biblioteca'
  | '/calendario'
  | '/informes'
  | '/configuracion'
  | '/alumno'
  | '/comunicaciones'

type NavigationItem = {
  to: AppRoute
  label: string
  icon: ComponentType<{ 'aria-hidden'?: boolean }>
}

const teacherItems: NavigationItem[] = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/alumnos', label: 'Alumnos', icon: Users },
  { to: '/profesores', label: 'Profesores', icon: GraduationCap },
  { to: '/clases', label: 'Clases', icon: BookOpen },
  { to: '/biblioteca', label: 'Biblioteca', icon: Library },
]

const placeholderItems: NavigationItem[] = [
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
  { to: '/informes', label: 'Informes', icon: ChartNoAxesColumn },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
]

const studentItems: NavigationItem[] = [
  { to: '/alumno', label: 'Mi portal', icon: BookOpen },
  { to: '/comunicaciones', label: 'Comunicaciones', icon: MessageCircle },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
  { to: '/configuracion', label: 'Ajustes', icon: SlidersHorizontal },
]

function NavigationLink({
  item,
  onNavigate,
}: {
  item: NavigationItem
  onNavigate: (() => void) | undefined
}) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === '/' }}
      activeProps={{ className: 'app-navigation-link app-navigation-link-active' }}
      className="app-navigation-link"
      onClick={onNavigate}
    >
      <Icon aria-hidden />
      {item.label}
    </Link>
  )
}

/** Navigation derived from the role, never from the current screen. */
export function PrimaryNavigation({
  role,
  onNavigate,
}: {
  role: DemoRole
  onNavigate?: () => void
}) {
  if (role === 'student') {
    return (
      <>
        <p className="app-navigation-section-label">Mi aprendizaje</p>
        {studentItems.map((item) => (
          <NavigationLink key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </>
    )
  }

  return (
    <>
      <p className="app-navigation-section-label">Escuela</p>
      {teacherItems.map((item) => (
        <NavigationLink key={item.to} item={item} onNavigate={onNavigate} />
      ))}
      <div className="app-navigation-divider" />
      <p className="app-navigation-section-label">Más herramientas</p>
      {placeholderItems.map((item) => (
        <NavigationLink key={item.to} item={item} onNavigate={onNavigate} />
      ))}
    </>
  )
}
