import Baileys from '@whiskeysockets/baileys'
import Utils from '../utils/Util.js'
import { createLogger } from '../utils/Logger.js'
import DatabaseHandler from '../handler/Database.js'
import DefineMesssage from '../decorators/DefineMesssage.js'
export default class Devi {
    constructor(config, saveCreds, options) {}

    connect = async () => {
        socket = Baileys(this.options)
        const { default: DB, saveContacts } = new DatabaseHandler(socket)
        let handler
        socket.ev.on('creds.update', this.saveCreds)
        socket.ev.on('messages.upsert', async (M) => {
            handler = await new DefineMesssage(M, socket).build()
        })
        socket.ev.on('connection.update', async (update) => {
            const { connection } = update
            if (connection === 'close') setTimeout(() => this.connect(), 3000)
            if (connection === 'connecting') socket.log.info('Connecting to the phone!')
        })
        socket.ev.on('contacts.update', (contact) => saveContacts(contact))

        // prettier-ignore
        Object.assign(socket, {
            config, utils: new Utils(), log: createLogger(),
            DB, handler
        })
        return socket
    }
}
