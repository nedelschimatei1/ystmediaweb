export class ServerError extends Error {
  code?: string
  details?: unknown
  status: number
  constructor(message: string, opts?: { code?: string; status?: number; details?: unknown }) {
    super(message)
    this.name = 'ServerError'
    this.code = opts?.code
    this.details = opts?.details
    this.status = opts?.status ?? 500
  }
}

export function makeErrorResponse(err: unknown) {
  if (err instanceof ServerError) {
    return { error: err.message, code: err.code || 'server_error' }
  }
  const msg = err instanceof Error ? err.message : 'Server error'
  return { error: msg, code: 'server_error' }
}
