/**
 * Logger utility that only logs in development mode
 * Prevents information disclosure in production
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, but sanitize sensitive data in production
    if (isDevelopment) {
      console.error(...args)
    } else {
      // In production, log errors without sensitive data
      const sanitizedArgs = args.map(arg => {
        if (typeof arg === 'string' && arg.includes('NEXT_PUBLIC_')) {
          return '[REDACTED_ENV_VAR]'
        }
        return arg
      })
      console.error(...sanitizedArgs)
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  }
}

export default logger
