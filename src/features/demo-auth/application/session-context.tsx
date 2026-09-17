import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react'

import { useDemoSnapshot } from '@/features/demo-data'

import { demoIdentities, findIdentity, type DemoIdentity } from '../domain/identities'
import { createDemoSessionStore } from '../infrastructure/demo-session'

type DemoSessionValue = {
  identity: DemoIdentity | null
  identities: DemoIdentity[]
  ready: boolean
  signIn: (userId: string) => void
  signOut: () => void
}

const DemoSessionContext = createContext<DemoSessionValue | null>(null)

/** Keeps the selected demo identity. Changing identity never resets the data. */
export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => createDemoSessionStore(), [])
  const [userId, setUserId] = useState<string | null>(() => store.read())
  const snapshot = useDemoSnapshot()
  const data = snapshot.data ?? null

  const signIn = useCallback(
    (nextUserId: string) => {
      store.write(nextUserId)
      setUserId(nextUserId)
    },
    [store],
  )

  const signOut = useCallback(() => {
    store.clear()
    setUserId(null)
  }, [store])

  const value = useMemo<DemoSessionValue>(
    () => ({
      identity: data ? findIdentity(data, userId) : null,
      identities: data ? demoIdentities(data) : [],
      ready: data !== null,
      signIn,
      signOut,
    }),
    [data, signIn, signOut, userId],
  )

  return <DemoSessionContext value={value}>{children}</DemoSessionContext>
}

export function useDemoSession(): DemoSessionValue {
  const session = use(DemoSessionContext)
  if (!session) throw new Error('DemoSessionProvider no está montado.')
  return session
}
