import { QuickDB } from 'quick.db'
import { MongoDriver } from 'quickmongo'
export default class DatabaseHandler {
    constructor(config, log) {
        this.config = config
        this.log = log
        Object.assign(this, {
            command: this.DB.table('command'),
            group: this.DB.table('guild'),
            user: this.DB.table('user')
        })
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

    DB = new QuickDB() //{driver: this.driver}
}
