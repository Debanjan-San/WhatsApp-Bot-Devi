import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'leave',
            category: 'dev',
            description: {
                content: 'For Super Users'
            },
            modsOnly: true,
            exp: 1
        })
    }

    exec = async (M, { text }) => {
        const bye = [`*Goodbye* 👋`, 'Peace out', 'goodbye', 'I’ve got to get going', 'I must be going']
        const rand = this.client.util.getRandomInt(1, bye.length - 1)
        await M.reply(bye[rand])
        await this.client.groupLeave(M.from)
    }
}
