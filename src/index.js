import { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import P from 'pino'
import Devi from './libs/Devi.js'
;(async () => {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const config = {
        name: 'devi',
        mods: [],
        prefix: '.',
        url: 'mongodb+srv://debayand:das@cluster0.m1doif4.mongodb.net/?retryWrites=true&w=majority'
    }

    new Devi(config, saveCreds, {
        version: (await fetchLatestBaileysVersion()).version,
        auth: state,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true
    }).connect()
})()
