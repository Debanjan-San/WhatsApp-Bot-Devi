import { makeCacheableSignalKeyStore, fetchLatestBaileysVersion, useMongoDBAuthState } from '@iamrony777/baileys'
import { MongoClient } from 'mongodb'
import P from 'pino'
import Devi from './libs/Devi.js'
;(async () => {
    const config = {
        name: 'devi',
        mods: [],
        prefix: '.',
        url: 'mongodb+srv://debayand:das@cluster0.m1doif4.mongodb.net/?retryWrites=true&w=majority'
    }
    const mongo = new MongoClient(config.url, {
        socketTimeoutMS: 1_00_000,
        connectTimeoutMS: 1_00_000,
        waitQueueTimeoutMS: 1_00_000
    })
    const collection = mongo.db('session').collection('auth')
    const { state, saveCreds } = await useMongoDBAuthState(collection)

    new Devi(config, MongoClient, saveCreds, {
        version: (await fetchLatestBaileysVersion()).version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys)
        },
        logger: P({ level: 'silent' }),
        printQRInTerminal: true
    }).connect()
})()
