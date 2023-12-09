import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'gifsearch',
            aliases: ['gify'],
            category: 'search',
            description: {
                content: 'Sends a gif of a given topic',
                usage: '[text]'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Sorry you did not give any query!'))
        const data = await this.client.util.fetch(`https://g.tenor.com/v1/search?q=${text}&key=LIVDSRZULELA&limit=8`)
        const { media } = this.client.util.getRandomItem(data.results)
        return void (await M.replyRaw({
            video: await this.client.util.fetchBuffer(media[0]?.mp4?.url),
            gifPlayback: true
        }))
    }
}
