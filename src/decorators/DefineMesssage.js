import DefineGroup from './DefineGroup.js'
import Utils from '../utils/Util.js'
export default class DefineMesssage {
    supportedMediaMessages = new Array('imageMessage', 'videoMessage')

    mentioned = new Array()

    urls = new Array()

    util = new Utils()

    isAdminMessage = false

    numbers = []

    constructor(M, client) {
        this.client = client
        this.M = M
        this.sender = {}
        this.sender.jid =
            this.chat === 'dm' && this.M.key.fromMe
                ? this.client.util.sanitizeJid(this.client.user?.id || '')
                : this.chat === 'group'
                  ? this.client.util.sanitizeJid(M.key.participant || '')
                  : this.client.util.sanitizeJid(this.from)
        if (this.M.pushName) this.sender.username = this.M.pushName
        if (this.M.message?.ephemeralMessage) this.M.message = this.M.message.ephemeralMessage.message
        const { type } = this
        this.content = (() => {
            if (this.M.message?.buttonsResponseMessage)
                return this.M.message?.buttonsResponseMessage?.selectedButtonId || ''
            if (this.M.message?.listResponseMessage)
                return this.M.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ''
            return this.M.message?.conversation
                ? this.M.message.conversation
                : this.supportedMediaMessages.includes(type)
                  ? this.supportedMediaMessages
                        .map((type) => this.M.message?.[type]?.caption)
                        .filter((caption) => caption)[0] || ''
                  : this.M.message?.extendedTextMessage?.text
                    ? this.M.message?.extendedTextMessage.text
                    : ''
        })()
        const array =
            (M?.message?.[type]?.contextInfo?.mentionedJid ? M?.message[type]?.contextInfo?.mentionedJid : []) || []

        array.filter(this.util.isTruthy).forEach((jid) => this.mentioned.push(jid))

        if (this.M.message?.[type]?.contextInfo?.quotedMessage) {
            const { quotedMessage, participant } = this.M.message?.[type]?.contextInfo ?? {}
            if (quotedMessage && participant) {
                const { message, stanzaId } = JSON.parse(JSON.stringify(M).replace('quotedM', 'm')).message?.[type]
                    .contextInfo
                message.key = {
                    remoteJid: M.key.remoteJid,
                    fromMe: false,
                    participant: participant,
                    id: stanzaId
                }
                this.quoted = {
                    sender: participant,
                    message,
                    react: async (emoji) => {
                        this.client.relayMessage(
                            this.from,
                            {
                                reactionMessage: {
                                    key: message.key,
                                    text: emoji,
                                    senderTimestampMs: Math.round(Date.now() / 1000)
                                }
                            },
                            {
                                messageId: this.client.generateMessageTag()
                            }
                        )
                    }
                }
            }
        }
    }

    build = async () => {
        this.util.getUrls(this.content).forEach((url) => this.urls.push(url))
        if (this.chat === 'dm') return this
        this.group = await new DefineGroup(this.from, this.client).build()
        this.numbers = this.util.extractNumbers(this.content)
        if (this.group.admins.includes(this.sender.jid)) this.isAdminMessage = true
        return this
    }

    get raw() {
        return this.M
    }

    get chat() {
        return this.from.endsWith('g.us') ? 'group' : 'dm'
    }

    get from() {
        return this.M.key.remoteJid
    }

    get type() {
        return Object.keys(this.M.message || 0)[0]
    }

    reply = async (content, type = 'text', mimetype, caption, mentions, options = {}) => {
        options.quoted = this.M
        if (type === 'text' && Buffer.isBuffer(content)) throw new Error('Cannot send a Buffer as a text message')
        return this.client.sendMessage(
            this.from,
            {
                [type]: content,
                mimetype,
                mentions,
                caption
            },
            options
        )
    }

    replyWithButtons = async (text, button, media) => {
        const rest = media ? { [media.type]: media.content } : {}
        const buttons = button.map((displayText) => ({
            type: 1,
            buttonId: 'ETHEREAL-BUTTON-'.concat(this.util.getRandomString(10)),
            buttonText: {
                displayText
            }
        }))
        return this.client.sendMessage(
            this.from,
            {
                text,
                buttons,
                ...rest
            },
            {
                quoted: this.M
            }
        )
    }

    replyRaw = async (msg) => {
        return this.client.sendMessage(this.from, msg, { quoted: this.M })
    }

    react = async (emoji) => {
        await this.client.sendMessage(this.from, {
            react: {
                key: this.M.key,
                text: emoji
            }
        })
    }
}
