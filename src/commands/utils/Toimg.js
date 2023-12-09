import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'toimage',
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
        if (M.quoted?.message.stickerMessage?.isAnimated)
            return void (await M.reply('❌ Animated sticker is not supported!'))
        return void (await M.reply(await this.client.util.downloadMediaMessage(media), 'image'))
    }
}
