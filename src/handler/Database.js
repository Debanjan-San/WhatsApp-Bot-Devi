import { QuickDB } from 'quick.db'
import { MongoDriver } from 'quickmongo'
export default class DatabaseHandler {
    constructor(config, log) {
        this.config = config
        this.log = log
        const url = this.config.mongo
        if (!url) {
            this.log.error('MONGODB_URL is missing, please fill the value!')
            process.exit(1)
        }
        this.driver = new MongoDriver(url)
    }

    connect = () => {
        return new Promise((resolve) => {
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
                            user: database.table('user'),
                            session: database.table('session')
                        },
                        database
                    )

                    resolve({ connected: true })
                })
                .catch((err) => {
                    this.log.error(err)
                    resolve({ connected: false })
                })
        })
    }

    getAllUsers = async () => {
        const users = (await this.user.all()).map((x) =>
            Object.entries(x.value.whatsapp.net).reduce(
                (acc, [key, value]) => {
                    acc[key] = value
                    return acc
                },
                {
                    jid: `${x.id}.whatsapp.net`
                }
            )
        )
        return users
    }

    getUserInfo = async (jid) => {
        const isMod = this.config.mods.includes(jid)
        const exp = (await this.user.get(`${jid}.exp`)) ?? 0
        const status = (await this.user.get(`${jid}.status`)) ?? {
            isBan: false,
            reason: ''
        }
        return {
            jid,
            isMod,
            exp,
            status
        }
    }
}
