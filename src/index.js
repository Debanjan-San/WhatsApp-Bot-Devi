import { makeCacheableSignalKeyStore, fetchLatestBaileysVersion, useMongoDBAuthState } from '@iamrony777/baileys'
import { createLogger } from './utils/Logger.js'
import DatabaseHandler from './handler/Database.js'
import { MongoClient } from 'mongodb'
import P from 'pino'
import Devi from './libs/Devi.js'
;(async () => {
    const log = createLogger()
    const config = {
        name: 'devi',
        mods: [],
        prefix: '.',
        url: 'mongodb+srv://cara:das1234@cluster0.d2czz.mongodb.net/?retryWrites=true&w=majority'
    }
    if (!config.url) {
        log.error('No mongo url provided')
        return process.exit(1)
    }
    const mongo = new MongoClient(config.url, {
        socketTimeoutMS: 1_00_000,
        connectTimeoutMS: 1_00_000,
        waitQueueTimeoutMS: 1_00_000
    })
    const databaseHandler = new DatabaseHandler(config, log)
    const collection = mongo.db('session').collection('auth')
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
