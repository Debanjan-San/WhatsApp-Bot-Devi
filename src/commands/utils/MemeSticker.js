import BaseCommand from '../../libs/BaseCommand.js'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'memesticker',
            category: 'utils',
            aliases: ['ms'],
            description: {
                content: 'Changes the sticker packname and authorname',
                usage: '[top] | [bottom]'
            },
            dm: true,
            exp: 8
        })
    }

    exec = async (M, { text }) => {
        const media = Object.keys(M.quoted?.message).includes('stickerMessage') ? M.quoted?.message : M.urls[0] ?? null
        if (!media) return void (await M.reply('❌ No sticker found!'))
        const [top, bottom] = text.split('|')
        if (!top || !bottom)
            return void (await M.reply(`❌ No text found!\nEx: ${this.client.config.prefix}memesticker top|bottom`))
        const base64 = await this.client.util.bufferToBase64(await this.client.util.downloadMediaMessage(image))
        const icon = await getDisplayUrl(base64, this.client.config.imgbb, M.sender.username)
        const data = await this.client.util.fetch(
            `https://api.memegen.link/images/custom/${top}/${bottom}.png?background=${icon}`
        )
        const sticker = new Sticker(await this.client.util.fetchBuffer(data), {
            pack: 'Davi Bot',
            author: 'By Debanjan',
            type: StickerTypes.FULL,
            quality: 70
        })
        return void (await M.reply(await sticker.build(), 'sticker'))
    }
}
