import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: lazyRouteComponent(() => import('@/features/demo-auth/ui/login-page'), 'LoginPage'),
})
