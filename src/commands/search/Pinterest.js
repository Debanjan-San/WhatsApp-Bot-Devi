import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'pinterest',
            aliases: ['pin'],
            category: 'search',
            description: {
                content: 'Sends a image from pinterest of a given topic',
                usage: '[query]'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void M.reply('❌ Please provide a word')
        const data = await this.client.util.fetch(`https://weeb-api.vercel.app/pinterest?query=${text}`)
        if (!data.length) return void (await M.reply('❌ Not Found'))
        const { imageUrl } = this.client.util.getRandomItem(data)
        return void (await M.reply(await this.client.util.fetchBuffer(imageUrl), 'image'))
    }
}
