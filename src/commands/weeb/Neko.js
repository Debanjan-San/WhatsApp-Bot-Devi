import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'neko',
            category: 'weeb',
            description: {
                content: 'Sends a random neko image'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M) => {
        const { url } = await this.client.util.fetch('https://api.waifu.pics/sfw/neko')
        return void (await M.reply(await this.client.util.fetchBuffer(url), 'image'))
    }
}
