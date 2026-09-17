import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { DemoSessionProvider } from '@/features/demo-auth'
import { DemoDataProvider } from '@/features/demo-data'

import { queryClient } from './router'

/** Single injection point of the demo persistence and the simulated session. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoDataProvider>
        <DemoSessionProvider>{children}</DemoSessionProvider>
      </DemoDataProvider>
    </QueryClientProvider>
  )
}
