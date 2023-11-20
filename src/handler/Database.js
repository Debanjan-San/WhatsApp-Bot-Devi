import { QuickDB } from 'quick.db'
import { MongoDriver } from 'quickmongo'
export default class DatabaseHandler {
    constructor(config, log) {
        this.config = config
        this.log = log
    }

    connect = () => {
        /*const url = this.config.url
        if (!url) {
            this.log.error('MONGODB_URL is missing, please fill the value!')
            process.exit(1)
        }
        this.driver = new MongoDriver(url)
        this.driver
            .connect()
            .then(() => {
                this.log.info('Database connection opened!')
                this.log.info('Database connected!')
            })
            .catch((err) => {
                this.log.error(err)
                process.exit(1)
            })*/
    }

    saveContacts = async (contacts) => {
        await Promise.all(
            contacts.map(async (contact) => {
                if (contact.id) {
                    await this.DB.set(contact.id, {
                        notify: contact.notify,
                        status: contact.status,
                        imgUrl: contact.imgUrl,
                        name: contact.name,
                        verifiedName: contact.verifiedName
                    })
                }
            })
        )
    }

    getContact = async (jid) => {
        const isMod = this.config.mods.includes(jid)
        const { notify, verifiedName, name, ban = false } = await this.DB.get(jid)
        return {
            username: notify || verifiedName || name || 'User',
            jid,
            isMod,
            ban
        }
    }

    DB = new QuickDB() //{driver: this.driver}
}
