import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'toimg',
            category: 'utils',
            description: {
                content: 'Converts sticker to image',
                usage: '[quote sticker]'
            },
            dm: true,
            exp: 7
        })
    }

    exec = async (M) => {
        const media = Object.keys(M.quoted?.message).includes('stickerMessage') ? M.quoted?.message : M.urls[0] ?? null
        if (!media) return void (await M.reply('❌ No sticker found!'))
        const type = M.quoted?.message.stickerMessage?.isAnimated ? 'video' : 'image'
        const buffer = await this.client.util.downloadMediaMessage(media)
        return void (await M.reply(type == 'video' ? await this.client.util.webpToMp4(buffer) : buffer, type))
    }
}
