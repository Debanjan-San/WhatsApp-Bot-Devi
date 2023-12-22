import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'instagram',
            aliases: ['igdl'],
            category: 'media',
            description: {
                content: 'Download media from Instagram',
                usage: '[instagram link]'
            },
            dm: true,
            exp: 5
        })
    }

    exec = async (M) => {
        if (!M.urls.length) return void (await M.reply('❌ Please provide a instagram URL'))
        const [url] = M.urls
        if (
            !(
                url.includes('instagram.com/p/') ||
                url.includes('instagram.com/reel/') ||
                url.includes('instagram.com/tv/')
            )
        )
            return void (await M.reply(`❌ Wrong URL! Only Instagram posted videos, tv and reels can be downloaded`))
        await this.client.util
            .fetch(`https://weeb-api.vercel.app/insta?url=${url}`)
            .then(({ urls }) => {
                urls.forEach(async ({ url, type }) => {
                    const buffer = await this.client.util.fetchBuffer(url)
                    await M.reply(buffer, type)
                })
            })
            .catch(() => M.reply('Error while getting video/image data'))
    }
}
