export default class BaseCommand {
    path = __dirname
    handler
    constructor(client, id, options) {
        this.client = client
        this.id = id
        this.options = options
    }

    exec(msg, args) {
        throw new Error('Exec Function must be declared')
    }
}
