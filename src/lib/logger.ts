type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    error: error
      ? { name: error.name, message: error.message, stack: error.stack }
      : undefined,
  }

  const isProd = process.env.NODE_ENV === 'production'

  if (isProd) {
    // In production, send to structured log aggregator (CloudWatch, Datadog, etc.)
    // For now, use JSON format so log parsers can consume it easily.
    console.log(JSON.stringify(entry))
  } else {
    const color = {
      debug: '\x1b[36m',
      info: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
    }[level]

    console.log(
      `${color}[${entry.timestamp}] ${level.toUpperCase()}\x1b[0m: ${message}`,
      context ? '\n' + JSON.stringify(context, null, 2) : '',
      error ? '\n' + error.stack : ''
    )
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>, err?: Error) => log('warn', msg, ctx, err),
  error: (msg: string, ctx?: Record<string, unknown>, err?: Error) => log('error', msg, ctx, err),
}
