import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'kitsune',
            category: 'weeb',
            description: {
                content: 'Sends random kitsune image'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M) => {
        const { url } = await this.client.util.fetch('https://nekos.life/api/v2/img/fox_girl')
        return void (await M.reply(await this.client.util.fetchBuffer(url), 'image'))
    }
}
