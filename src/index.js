import { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import Devi from './libs/Devi.js'
;(async () => {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const config = {
        name: 'devi',
        mods: [],
        prefix: '.'
    }

    new Devi(config, saveCreds, {
        version: (await fetchLatestBaileysVersion()).version,
        auth: state,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true
    }).connect()
})()
