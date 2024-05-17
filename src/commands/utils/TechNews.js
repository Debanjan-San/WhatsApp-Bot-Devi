import BaseCommand from '../../libs/BaseCommand.js'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'technews',
            aliases: ['tn'],
            category: 'utils',
            description: {
                content: 'Gives you tech related news'
            },
            dm: true,
            exp: 5
        })
    }

    exec = async (M) => {
        const { inshorts } = await this.client.util.fetch('https://pvx-api-vercel.vercel.app/api/news')
        let msg = '   💥 *TECH NEWS* 💥   '
        for (let i = 0; i < inshorts.length; ++i) {
            msg += `\n\n*${1 + i}#*\n${inshorts[i]}`
        }
        return void (await M.reply(msg))
    }
}
