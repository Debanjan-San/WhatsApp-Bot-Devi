import { URL } from 'url'
export default class BaseCommand {
    path = new URL('.', import.meta.url).pathname
    handler
    constructor(client, handler, config) {
        this.client = client
        this.handler = handler
        this.config = config
    }

    exec(msg, args) {
        throw new Error('Exec Function must be declared')
    }
}
