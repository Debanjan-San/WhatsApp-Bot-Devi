import BaseCommand from '../../libs/BaseCommand.js'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'toimage',
            category: 'utils',
            description: {
                content: 'Converts sticker to image/gif',
                usage: '[quote sticker]'
            },
            dm: true,
            exp: 7
        })
    }

    exec = async (M) => {
        const media = Object.keys(M.quoted?.message).includes('stickerMessage') ? M.quoted?.message : M.urls[0] ?? null
        if (!media) return void (await M.reply('No sticker found!'))
        const animated = M.quoted?.message.stickerMessage?.isAnimated
        const buffer = await this.client.util.downloadMediaMessage(media)
        const result = animated ? await this.client.util.webpToMp4(buffer) : await this.client.util.webpToPng(buffer)
        await M.reply(result, animated ? 'video' : 'image')
    }
}
