import { makeWASocket, makeMongoStore, DisconnectReason } from '@iamrony777/baileys'
import { Boom } from '@hapi/boom'
import Utils from '../utils/Util.js'
import { createLogger } from '../utils/Logger.js'
import DatabaseHandler from '../handler/Database.js'
import Message from '../decorators/DefineMesssage.js'
import MessageHandler from '../handler/Message.js'
export default class Devi {
    constructor(config, mongo, authSession, options) {
        this.log = createLogger()
        this.databaseHandler = DatabaseHandler
        this.message = Message
        this.MessageHandler = MessageHandler
        this.config = config
        this.mongo = mongo
        this.authSession = authSession
        this.options = options
    }

    connect = async () => {
        const socket = makeWASocket(this.options)
        const store = makeMongoStore({
            filterChats: true,
            db: this.mongo.db('session'),
            autoDeleteStatusMessage: true
        })
        const DB = new this.databaseHandler(this.config, this.log)
        await DB.connect()
        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update
            const { statusCode } = new Boom(lastDisconnect?.error).output
            if (qr) this.log.notice('Qr has been generated!!')
            if (connection === 'close') {
                if (statusCode !== DisconnectReason.loggedOut) setTimeout(() => this.connect(), 3000)
                else {
                    this.log.notice('Disconnected! Something went wrong during connection!')
                    await this.authSession.removeCreds()
                    setTimeout(() => this.connect(), 3000)
                }
            }
            if (connection === 'connecting') this.log.info('Connecting to the phone!')
            if (connection === 'open') {
                this.log.info('Connected to the phone >.<!')
                Object.assign(socket, { config: this.config, util: new Utils(), log: this.log, DB, store })
                this.render = new this.MessageHandler(socket)
                this.render.loadCommands()
            }
        })
        socket.ev.on('messages.upsert', async ({ messages }) => {
            const msg = JSON.parse(JSON.stringify(messages[0]))
            this.render.handler(await new this.message(msg, socket).build())
        })
        socket.ev.on('creds.update', async () => {
            await this.authSession.saveCreds()
        })
        store.bind(socket.ev)
        return socket
    }
}
