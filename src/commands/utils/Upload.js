import BaseCommand from '../../libs/BaseCommand.js'
import { getDisplayUrl } from '../../utils/Upload.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'upload',
            category: 'utils',
            aliases: ['tourl'],
            description: {
                content: 'Image to url.',
                usage: '[quote | [direct with image]]'
            },
            dm: true,
            exp: 8
        })
    }

    exec = async (M) => {
        if (!this.client.config.imgbb) return void (await M.reply('❌ No imgbb api found!'))
        const image = ['imageMessage'].includes(M.type) ? M : M.quoted?.message.imageMessage ? M.quoted.message : null
        if (!image) return void (await M.reply('❌ No image found!'))
        const base64 = await this.client.util.bufferToBase64(await this.client.util.downloadMediaMessage(image))
        const icon = await getDisplayUrl(base64, this.client.config.imgbb, M.sender.username)
        return void (await M.reply(icon))
    }
}
