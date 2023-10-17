export default class BaseCommand {
    path = __dirname
    handler
    constructor(client, id, options) {}

    exec(msg, args) {
        throw new Error('Exec Function must be declared')
    }
}
