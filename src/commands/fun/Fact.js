import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'fact',
            category: 'fun',
            description: {
                content: 'Sends random fact'
            },
            dm: true,
            exp: 3
        })
    }

    exec = async (M) => {
        const { fact } = await this.client.util.fetch('https://nekos.life/api/v2/fact')
        return void (await M.reply(fact))
    }
}
