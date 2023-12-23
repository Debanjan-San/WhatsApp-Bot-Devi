import BaseCommand from '../../libs/BaseCommand.js'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'sticker',
            category: 'utils',
            aliases: ['s'],
            description: {
                content: 'Convert Images/Videos into Stickers',
                usage: '[packname] | [authorname]'
            },
            dm: true,
            exp: 8
        })
    }

    exec = async (M, { text }) => {
        const media = ['imageMessage', 'videoMessage'].includes(M.type)
            ? M
            : M.quoted?.message.videoMessage ?? M.quoted?.message.imageMessage
              ? M.quoted.message
              : M.urls[0] ?? null
        if (!media) return void (await M.reply('❌ No media found!'))
        const [pack, title] = text.split('|')
        const sticker = new Sticker(
            typeof media === 'string' ? media : await this.client.util.downloadMediaMessage(media),
            {
                pack: pack ?? 'Davi Bot',
                author: title ?? 'By Debanjan',
                type: StickerTypes.FULL,
                quality: 70
            }
        )
        await M.reply(await sticker.build(), 'sticker')
    }
}
