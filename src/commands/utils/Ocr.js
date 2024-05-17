import BaseCommand from '../../libs/BaseCommand.js'
import { getDisplayUrl } from '../../utils/Upload.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'ocr',
            category: 'utils',
            aliases: ['scan'],
            description: {
                content: 'Extracts text from image.',
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
        const data = await this.client.util.fetch(
            `https://api.ocr.space/parse/imageurl?apikey=K86862197988957&url=${icon}&language=eng&isOverlayRequired=false`
        )
        return void (await M.reply(
            `🔍 *OCR:*\n\n ${data.ParsedResults.map(({ ParsedText }) => ParsedText).join('\n\n ')}`
        ))
    }
}
