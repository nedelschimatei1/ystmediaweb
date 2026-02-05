import logger from './logger'
import { redactEmail } from './input'

function redactSecrets(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj
  const res: any = Array.isArray(obj) ? [...obj] : { ...obj }
  const sensitive = ['token', 'password', 'pass', 'secret', 'authorization', 'smtp_pass', 'smtp_user']
  for (const k of Object.keys(res)) {
    const lower = k.toLowerCase()
    if (sensitive.some(s => lower.includes(s))) {
      res[k] = '[REDACTED]'
    } else if (k === 'email') {
      res[k] = redactEmail(String(res[k]))
    } else if (typeof res[k] === 'object') {
      res[k] = redactSecrets(res[k])
    }
  }
  return res
}

export function safeLogError(err: unknown, context?: Record<string, any>) {
  const ctx = redactSecrets(context || {})
  logger.error({ err, ...ctx }, 'handled_error')
}

export default { safeLogError }
