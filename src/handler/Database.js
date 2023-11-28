import { QuickDB } from 'quick.db'
import { MongoDriver } from 'quickmongo'
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
}
