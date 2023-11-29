import { QuickDB } from 'quick.db'
import { MongoDriver } from 'quickmongo'
import { getStats } from '../libs/LevelSystem.js'
export default class DatabaseHandler {
    constructor(config, log) {
        this.config = config
        this.log = log
        const url = this.config.url
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
                const database = new QuickDB({ driver: this.driver })
                Object.assign(
                    this,
                    {
                        command: database.table('command'),
                        group: database.table('guild'),
                        user: database.table('user')
                    },
                    database
                )
            })
            .catch((err) => {
                this.log.error(err)
                process.exit(1)
            })
    }

    getUserInfo = async (jid, client) => {
        const isMod = client.config.mods.includes(jid)
        const { notify } = await client.store?.getContactInfo(jid, client)
        const exp = (await client.DB.user.get(`${jid}.exp`)) ?? 0
        const level = (await client.DB.user.get(`${jid}.level`)) ?? 1
        const ban = (await client.DB.user.get(`${jid}.ban`)) ?? false
        const reason = (await client.DB.user.get(`${jid}.username`)) ?? ''
        const { requiredXpToLevelUp, rank } = getStats(level)
        return {
            username: notify ?? 'User',
            jid,
            isMod,
            exp,
            level,
            ban,
            reason,
            requiredXpToLevelUp,
            rank
        }
    }
}
