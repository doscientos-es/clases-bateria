import type { DemoData } from '../domain/entities'
import { DemoError } from '../domain/errors'
import { loadSeed } from './seed-loader'

export const DEMO_STORAGE_KEY = 'clases-bateria.demo.v3'

function readStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function parse(raw: string): DemoData | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const candidate = parsed as Partial<DemoData>
    if (!candidate.school || !Array.isArray(candidate.students)) return null
    return candidate as DemoData
  } catch {
    return null
  }
}

/** Versioned localStorage store with an in-memory fallback. */
export type DemoStore = {
  read(): DemoData
  write(data: DemoData): void
  reset(): DemoData
}

export function createLocalStore(): DemoStore {
  const storage = readStorage()
  let memory: DemoData | null = null

  function persist(data: DemoData): void {
    memory = data
    if (!storage) return
    try {
      storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))
    } catch {
      throw new DemoError('persistence', 'No se han podido guardar los cambios.')
    }
  }

  return {
    read() {
      if (memory) return memory
      const raw = storage?.getItem(DEMO_STORAGE_KEY) ?? null
      const stored = raw ? parse(raw) : null
      const data = stored ?? loadSeed()
      persist(data)
      return data
    },
    write(data) {
      persist(data)
    },
    reset() {
      memory = null
      storage?.removeItem(DEMO_STORAGE_KEY)
      const data = loadSeed()
      persist(data)
      return data
    },
  }
}
