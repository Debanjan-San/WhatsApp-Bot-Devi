import Baileys, { fetchLatestBaileysVersion, useMultiFileAuthState } from '@whiskeysockets/baileys'
import Utils from '../utils/Util.js'
import { createLogger } from '../utils/Logger.js'
import DatabaseHandler from '../handler/Database.js'
import Message from '../decorators/DefineMesssage.js'
import MessageHandler from '../handler/Message.js'

export default class Devi {
    constructor() {
        this.config = {
            name: 'devi',
            mods: [],
            prefix: '.'
        }
        this.handler
        this.log = createLogger()
        this.databaseHandler = DatabaseHandler
        this.message = Message
        this.MessageHandler = MessageHandler
    }

    connect = async () => {
        const { state, saveCreds } = await useMultiFileAuthState('session')
        socket = Baileys({
            version: (await fetchLatestBaileysVersion()).version,
            auth: state,
            logger: P({ level: 'silent' }),
            printQRInTerminal: true
        })
        const { default: DB, saveContacts } = new this.databaseHandler(socket)
        socket.ev.on('creds.update', this.saveCreds)
        socket.ev.on('messages.upsert', async (M) => {
            await new this.message(M, socket).build()
            const { loadCommands, handler } = new this.MessageHandler(socket)
            this.handler = handler(M)
            loadCommands()
        })
        socket.ev.on('connection.update', async (update) => {
            const { connection } = update
            if (connection === 'close') setTimeout(() => this.connect(), 3000)
            if (connection === 'connecting') this.log.info('Connecting to the phone!')
        })
        socket.ev.on('contacts.update', (contact) => saveContacts(contact))

        // prettier-ignore
        Object.assign(socket, {
            config: this.config, util: new Utils(), log: this.log,
            DB, handler: this.handler
        })
        return socket
    }
}
