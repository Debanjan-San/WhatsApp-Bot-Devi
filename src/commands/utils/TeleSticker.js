import BaseCommand from '../../libs/BaseCommand.js'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'telesticker',
            category: 'utils',
            aliases: ['tls'],
            description: {
                content: 'Convert telegram stickers into whatsapp Stickers',
                usage: '[link]'
            },
            dm: true,
            exp: 8
        })
    }

    exec = async (M) => {
        if (!M.urls.length) return void (await M.reply('❌ Link?'))
        const url = M.urls.find((url) => url.includes('t.me/addstickers'))
        if (!url) return void (await M.reply('❌ No telegram addstickers URLs found in your message'))
        const { name, title, stickers } = await this.client.util.fetch(
            `https://weeb-api.vercel.app/telesticker?url=${url}`
        )
        await M.reply('✔️ Sending strickers in your private chat')
        for (const sticker of stickers) {
            await this.client.sendMessage(M.sender.jid, {
                sticker: await new Sticker(sticker, {
                    pack: name,
                    author: title,
                    type: StickerTypes.FULL,
                    quality: 70
                }).build()
            })
        }
    }
}
