import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'uniform',
            category: 'weeb',
            description: {
                content: 'Sends a random uniform image'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M) => {
        const { images } = await this.client.util.fetch('https://api.waifu.im/search/?included_tags=uniform')
        return void (await M.reply(await this.client.util.fetchBuffer(images[0].url), 'image'))
    }
}
