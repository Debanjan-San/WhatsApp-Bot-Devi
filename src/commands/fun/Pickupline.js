import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'pickupline',
            category: 'fun',
            description: {
                content: 'Sends random pickupline'
            },
            dm: true,
            exp: 3
        })
    }

    exec = async (M) => {
        const { pickup } = await this.client.util.fetch('https://vinuxd.vercel.app/api/pickup')
        return void (await M.reply(pickup))
    }
}
