export const DEMO_SESSION_KEY = 'clases-bateria.demo.v1.session'

function readStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

/** Persists which demo identity is active. Never stores credentials. */
export type DemoSessionStore = {
  read(): string | null
  write(userId: string): void
  clear(): void
}

export function createDemoSessionStore(): DemoSessionStore {
  const storage = readStorage()
  let memory: string | null = null

  return {
    read() {
      return memory ?? storage?.getItem(DEMO_SESSION_KEY) ?? null
    },
    write(userId) {
      memory = userId
      storage?.setItem(DEMO_SESSION_KEY, userId)
    },
    clear() {
      memory = null
      storage?.removeItem(DEMO_SESSION_KEY)
    },
  }
}
