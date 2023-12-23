import { makeCacheableSignalKeyStore, fetchLatestBaileysVersion, useMongoDBAuthState } from '@iamrony777/baileys'
import { createLogger } from './utils/Logger.js'
import DatabaseHandler from './handler/Database.js'
import getConfig from './getConfig.js'
import { MongoClient } from 'mongodb'
import Devi from './libs/Devi.js'
import P from 'pino'
;(async () => {
    const log = createLogger()
    const config = getConfig()
    if (!config.mongo) {
        log.error('No mongo url provided')
        return process.exit(1)
    }
    const mongo = new MongoClient(config.mongo, {
        socketTimeoutMS: 1_00_000,
        connectTimeoutMS: 1_00_000,
        waitQueueTimeoutMS: 1_00_000
    })
    const databaseHandler = new DatabaseHandler(config, log)
    const collection = mongo.db(config.session).collection('auth')
    const authSession = await useMongoDBAuthState(collection)
    new Devi(config, mongo, authSession, log, databaseHandler, {
        version: (await fetchLatestBaileysVersion()).version,
        auth: {
            creds: authSession.state.creds,
            keys: makeCacheableSignalKeyStore(authSession.state.keys)
        },
        logger: P({ level: 'silent' }),
        printQRInTerminal: true
    }).connect()
})()
