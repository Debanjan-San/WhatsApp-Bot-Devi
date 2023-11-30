import BaseCommand from '../../libs/BaseCommand.js'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'steal',
            category: 'utils',
            aliases: ['take'],
            description: {
                content: 'Changes the sticker packname and authorname',
                usage: '[packname] | [authorname]'
            },
            dm: true,
            exp: 8
        })
    }

    exec = async (M, { text }) => {
        const media = Object.keys(M.quoted?.message).includes('stickerMessage') ? M.quoted?.message : M.urls[0] ?? null
        if (!media) return void (await M.reply('No sticker found!'))
        const [pack, title] = text.split('|')
        const sticker = new Sticker(await this.client.util.downloadMediaMessage(media), {
            pack: pack ?? 'Davi Bot',
            author: title ?? 'By Debanjan',
            type: StickerTypes.FULL,
            quality: 70
        })
        await M.reply(await sticker.build(), 'sticker')
    }
}
