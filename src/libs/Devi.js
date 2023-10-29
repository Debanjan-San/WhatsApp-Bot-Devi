import { makeWASocket } from '@whiskeysockets/baileys'
import Utils from '../utils/Util.js'
import { createLogger } from '../utils/Logger.js'
import DatabaseHandler from '../handler/Database.js'
import Message from '../decorators/DefineMesssage.js'
import MessageHandler from '../handler/Message.js'
export default class Devi {
    constructor(config, saveCreds, options) {
        this.handler
        this.log = createLogger()
        this.databaseHandler = DatabaseHandler
        this.message = Message
        this.MessageHandler = MessageHandler
        this.config = config
        this.saveCreds = saveCreds
        this.options = options
    }

    connect = async () => {
        const socket = makeWASocket(this.options)
        const DB = new this.databaseHandler(this.config, this.log)
        await DB.connect()
        socket.ev.on('messages.upsert', async ({ messages }) => {
            const msg = JSON.parse(JSON.stringify(messages[0]))
            await new this.message(msg, socket).build()
            const { loadCommands, handler } = new this.MessageHandler(socket)
            this.handler = handler(msg)
            loadCommands()
        })
        socket.ev.on('connection.update', async (update) => {
            const { connection } = update
            if (connection === 'close') setTimeout(() => this.connect(), 3000)
            if (connection === 'connecting') this.log.info('Connecting to the phone!')
            if (connection === 'open') this.log.info('Connected to the phone >.<!')
        })
        socket.ev.on('contacts.update', (contact) => DB.saveContacts(contact))
        socket.ev.on('creds.update', this.saveCreds)
        // prettier-ignore
        Object.assign(socket, {
            config: this.config, util: new Utils(), log: this.log,
            DB, handler: this.handler
        })
        return socket
    }
}
