import P from 'pino'
import Devi from './libs/Devi.js'
import { createLogger } from './utils/Logger.js'
import getConfig from './getConfig.js'
import AuthenticationFromDatabase from './libs/Authentication.js'
import DatabaseHandler from './handler/Database.js'
;(async () => {
    const log = createLogger()
    const config = getConfig()
    if (!config.mongo) {
        log.error('No mongo url provided')
        return process.exit(1)
    }
    const database = new DatabaseHandler(config, log)
    await database.connect()
    const { useDatabaseAuth } = new AuthenticationFromDatabase(config.session, database)
    const authSession = await useDatabaseAuth()
    new Devi(config, authSession, log, database, {
        version:  [2, 2413, 1],
        auth: authSession.state,
        syncFullHistory: false,
        logger: P({ level: 'fatal' }),
        printQRInTerminal: true,
        getMessage: async () => {
            return {
                conversation: ''
            }
        }
    }).connect()
})()
