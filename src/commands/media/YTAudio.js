import BaseCommand from '../../libs/BaseCommand.js'
import YT from '../../utils/YT.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'ytaudio',
            aliases: ['yta'],
            category: 'media',
            description: {
                content: 'Download Audio from Youtube',
                usage: '[YT link]'
            },
            dm: true,
            exp: 5
        })
    }

    exec = async (M) => {
        if (!M.urls.length) return void (await M.reply('❌ Please provide a youtube URL'))
        const [url] = M.urls
        const video = new YT(url, 'audio')
        if (!video.validateURL()) return void (await M.reply('❌ Invalid URL'))
        const { videoDetails } = await video.getInfo()
        await M.replyRaw({
            caption: `📗 *Title: ${videoDetails.title}*\n📕 *Channel: ${videoDetails.author.name}*\n📙 *Duration: ${videoDetails.lengthSeconds}s*`,
            image: await this.client.util.fetchBuffer(videoDetails.thumbnails[0].url)
        })
        if (parseInt(videoDetails.lengthSeconds) > 600) return void (await M.reply('❌ Audio is too long'))
        try {
            return void (await M.replyRaw({
                audio: await video.getBuffer(),
                mimetype: 'audio/mp4',
                fileName: videoDetails.title
            }))
        } catch (e) {
            return void (await M.reply('❌ Failed to download Audio '.concat(typeof e === 'string' ? e : '')))
        }
    }
}
