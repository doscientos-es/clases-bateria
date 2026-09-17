export type DemoErrorCode = 'not-found' | 'validation' | 'duplicated' | 'persistence' | 'forbidden'

/** Typed error surfaced by use cases so the UI can show a recoverable message. */
export class DemoError extends Error {
  readonly code: DemoErrorCode

  constructor(code: DemoErrorCode, message: string) {
    super(message)
    this.name = 'DemoError'
    this.code = code
  }
}

/** Human readable message for any thrown value. */
export function describeError(error: unknown): string {
  if (error instanceof DemoError) return error.message
  if (error instanceof Error) return error.message
  return 'Se ha producido un error inesperado.'
}
