import BaseCommand from '../../libs/BaseCommand.js'
import google from 'googlethis'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'imagesearch',
            category: 'search',
            description: {
                content: 'Searches image from google.com',
                usage: '[text]'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Sorry you did not give any query!'))
        let safe = false
        const { nsfw } = (await this.client.DB.group.get(M.from)) ?? {
            nsfw: false
        }
        if (!nsfw) safe = true
        const options = {
            page: 0,
            safe,
            parse_ads: false,
            additional_params: {
                hl: 'en'
            }
        }
        const results = await google.image(text.trim(), { safe }).catch((err) => {
            return void M.reply('❌ Could not find the searched term')
        })
        const image = await this.client.util.fetchBuffer(results[0].url)
        return void (await M.reply(image, 'image'))
    }
}
