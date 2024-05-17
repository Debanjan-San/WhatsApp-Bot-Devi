import BaseCommand from '../../libs/BaseCommand.js'
import { getDisplayUrl } from '../../utils/Upload.js'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'memesticker',
            category: 'utils',
            aliases: ['ms'],
            description: {
                content: 'Write text Image.',
                usage: '[text1] | [text2]'
            },
            dm: true,
            exp: 8
        })
    }

    exec = async (M, { text }) => {
        if (!this.client.config.imgbb) return void (await M.reply('❌ No imgbb api found!'))
        const image = ['imageMessage'].includes(M.type) ? M : M.quoted?.message.imageMessage ? M.quoted.message : null
        if (!image) return void (await M.reply('❌ No image found!'))
        const base64 = await this.client.util.bufferToBase64(await this.client.util.downloadMediaMessage(image))
        const icon = await getDisplayUrl(base64, this.client.config.imgbb, M.sender.username)
        const [title1, title2] = text.split('|')
        if (!title1) return void (await M.reply('❌ Please provide the text 1!!'))
        if (!title2) return void (await M.reply('❌ Please provide the text 2!!'))
        const buffer = await this.client.util.fetchBuffer(
            `https://api.memegen.link/images/custom/${title1}/${title2}.png?background=${icon}`
        )
        const sticker = new Sticker(buffer, {
            pack: `${this.client.config.name} Bot`,
            author: 'By Debanjan',
            type: StickerTypes.FULL,
            quality: 70
        })
        await M.reply(await sticker.build(), 'sticker')
    }
}
