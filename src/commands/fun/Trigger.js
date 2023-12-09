import BaseCommand from '../../libs/BaseCommand.js'
import { getDisplayUrl } from '../../utils/Upload.js'
import { Triggered } from '@shineiichijo/canvas-chan'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'trigger',
            category: 'fun',
            aliases: ['triggered'],
            description: {
                content: 'Tigger users',
                usage: '[quote] || @user'
            },
            exp: 8
        })
    }

    exec = async (M) => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!this.client.config.imgbb) return void (await M.reply('❌ No imgbb api found!'))
        const url =
            (await this.client.profilePictureUrl(M.mentioned[0] ?? M.sender.jid, 'image').catch(() => null)) ??
            'https://static.wikia.nocookie.net/v__/images/7/73/Fuseu404notfound.png/revision/latest?cb=20171104190424&path-prefix=vocaloidlyrics'
        const base64 = await this.client.util.bufferToBase64(await this.client.util.fetchBuffer(url))
        const icon = await getDisplayUrl(base64, this.client.config.imgbb, M.sender.username)
        const sticker = await new Sticker(await new Triggered(icon).build(), {
            pack: 'Davi Bot',
            author: 'By Debanjan',
            type: StickerTypes.FULL,
            quality: 70
        })
        await M.reply(await sticker.build(), 'sticker')
    }
}
