import winston from 'winston'
import { format } from 'date-fns'

export const createLogger = (prod = false) => {
    const logger = winston.createLogger({
        level: prod ? 'info' : 'debug',
        levels: {
            alert: 1,
            debug: 5,
            error: 0,
            info: 4,
            notice: 3,
            warn: 2
        },
        transports: [
            new winston.transports.File({
                filename: `logs/error-${format(Date.now(), 'yyyy-MM-dd-HH-mm-ss')}.log`,
                level: 'error'
            }),
            new winston.transports.File({
                filename: `logs/logs-${format(Date.now(), 'yyyy-MM-dd-HH-mm-ss')}.log`
            })
        ],
        format: winston.format.combine(
            winston.format.printf((info) => {
                const { level, message, stack } = info
                const prefix = `[${format(Date.now(), 'yyyy-MM-dd HH:mm:ss (x)')}] [${level}]`
                if (['error', 'crit'].includes(level)) return `${prefix}: ${stack ?? message}`
                return `${prefix}: ${message}`
            })
        )
    })
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.printf((info) => {
                    const { level, message, stack } = info
                    const prefix = `[${format(Date.now(), 'yyyy-MM-dd HH:mm:ss (x)')}] [${level}]`
                    if (['error', 'alert'].includes(level) && !prod) return `${prefix}: ${stack ?? message}`
                    return `${prefix}: ${message}`
                }),
                winston.format.align(),
                prod ? winston.format.colorize({ all: false }) : winston.format.colorize({ all: true })
            )
        })
    )
    return logger
}
