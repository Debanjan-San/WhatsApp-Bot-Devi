import { connect } from 'mongoose'
import { contacts } from '../models/index.js'
export default class DatabaseHandler {
    connected = false
    connection
    constructor(config, log) {
        this.config = config
        this.log = log
    }
    async connect() {
        const url = this.config.url
        if (!url) {
            this.log.error('MONGODB_URL is missing, please fill the value!')
            return process.exit(1)
        }
        try {
            const { connection } = await connect(url)
            connection.once('open', () => this.log.info('Database connection opened!'))
            connection.on('connected', () => this.log.info('Database connected!'))
            connection.on('error', (error) => this.log.error(error))
            this.connection = connection
            this.connected = true
        } catch (e) {
            this.log.error(e)
            this.connection = undefined
            this.connected = false
        }
    }

    saveContacts = async (infos) => {
        if (!this.contacts.has('contacts')) {
            const data = this.getContact()
            this.contacts.set('contacts', data)
        }
        const data = this.contacts.get('contacts')
        for (const info of infos) {
            if (info.id) {
                const index = data.findIndex(({ id }) => id === info.id)
                if (index >= 0) {
                    if (info.notify !== data[index].notify) data[index].notify = info.notify
                    continue
                }
                data.push({
                    id: info.id,
                    notify: info.notify,
                    status: info.status,
                    imgUrl: info.imgUrl,
                    name: info.name,
                    verifiedName: info.verifiedName
                })
            }
        }
        this.contacts.set('contacts', data)
        await contacts.updateOne({ ID: 'contacts' }, { $set: { data } })
    }

    getContact = (jid) => {
        const contact = this.contacts.get('contacts')
        const isMod = this.config.mods.includes(jid)
        if (!contact)
            return {
                username: 'User',
                jid,
                isMod
            }
        const index = contact.findIndex(({ id }) => id === jid)
        if (index < 0)
            return {
                username: 'User',
                jid,
                isMod
            }
        const { notify, verifiedName, name } = contact[index]
        return {
            username: notify || verifiedName || name || 'User',
            jid,
            isMod
        }
    }

    contacts = new Map()
}
