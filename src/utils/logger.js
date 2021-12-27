import { createLogger, format, transports } from 'winston'

const { combine, timestamp, prettyPrint } = format

const { Console, File } = transports

const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new File({
      filename: 'logs/combined.log',
      level: 'info',
      maxsize: 10000000
    }),
    new File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10000000
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new Console())
}

export default logger
