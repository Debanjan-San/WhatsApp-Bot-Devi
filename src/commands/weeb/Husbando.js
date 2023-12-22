import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'husbando',
            category: 'weeb',
            description: {
                content: 'Sends a random husbando image'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M) => {
        const { results } = await this.client.util.fetch('https://nekos.best/api/v2/husbando')
        return void (await M.reply(await this.client.util.fetchBuffer(results[0].url), 'image'))
    }
}
