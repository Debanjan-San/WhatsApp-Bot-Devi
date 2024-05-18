import { makeWASocket, DisconnectReason } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import Server from './Server.js'
import { imageSync } from 'qr-image'
import Utils from '../utils/Util.js'
import Message from '../decorators/DefineMesssage.js'
import Participant from '../handler/Participants.js'
import MessageHandler from '../handler/Message.js'
export default class Devi {
    constructor(config, authSession, log, databaseHandler, options) {
        this.log = log
        this.DB = databaseHandler
        this.message = Message
        this.MessageHandler = MessageHandler
        this.Participant = Participant
        this.config = config
        this.authSession = authSession
        this.options = options
        this.server = new Server(config, log)
    }

    connect = async () => {
        const socket = makeWASocket(this.options)
        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update
            const { statusCode } = new Boom(lastDisconnect?.error).output
            if (qr) {
                this.server.qr = imageSync(qr)
                this.log.notice('Qr has been generated!!')
            }
            if (connection === 'close') {
                if (statusCode !== DisconnectReason.loggedOut) setTimeout(() => this.connect(), 3000)
                else {
                    this.log.notice('Disconnected! Something went wrong during connection!')
                    await this.authSession.clearState()
                    setTimeout(() => this.connect(), 3000)
                }
            }
            if (connection === 'connecting') this.log.info('Connecting to the phone!')
            if (connection === 'open') {
                this.server.connection = connection
                this.log.info('Connected to the phone >.<!')
                Object.assign(socket, { config: this.config, util: new Utils(), log: this.log, DB: this.DB })
                this.render = new this.MessageHandler(socket)
                this.event = new this.Participant(socket)
                this.render.loadCommands()
            }
        })
        socket.ev.on('group-participants.update', async (event) => await this.event.participantUpdate(event))
        socket.ev.on('messages.upsert', async ({ messages }) => {
            const msg = JSON.parse(JSON.stringify(messages[0]))
            this.render.handler(await new this.message(msg, socket).build())
        })
        socket.ev.on('creds.update', async () => {
            await this.authSession.saveState()
        })
    }
}
