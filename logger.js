const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format

const logFormat = printf(info => {
  return `${process.env.PROGRAM_ALIAS || ''}:${info.timestamp}:${info.level}: ${info.message}`
})

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
  ],
})

// If we're not in production then log to files also
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    // - Write all logs error (and below) to `error.log`.
    new transports.File({ filename: 'error.log', level: 'error' })
  )
  logger.add(
    // - Write to all logs with level `info` and below to `combined.log`
    new transports.File({ filename: 'combined.log' })
  )
}

module.exports = logger

