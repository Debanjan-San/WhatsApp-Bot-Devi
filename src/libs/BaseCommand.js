export default class BaseCommand {
    path = __dirname
    handler
    constructor(client, handler) {
        this.client = client
        this.handler = handler
    }

    exec(msg, args) {
        throw new Error('Exec Function must be declared')
    }
}
