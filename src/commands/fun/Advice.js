import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'advice',
            aliases: ['adv'],
            category: 'fun',
            description: {
                content: 'Sends random advices'
            },
            dm: true,
            exp: 3
        })
    }

    exec = async (M) => {
        const { slip } = await this.client.util.fetch('https://api.adviceslip.com/advice')
        return void (await M.reply(slip.advice))
    }
}
