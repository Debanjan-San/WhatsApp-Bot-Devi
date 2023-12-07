import BaseCommand from '../../libs/BaseCommand.js'
import YT from '../../utils/YT.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'ytvideo',
            aliases: ['ytv'],
            category: 'media',
            description: {
                content: 'Download video from Youtube',
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
            caption: `⚡ *Title: ${videoDetails.title}*
🚀 *Views: ${videoDetails.viewCount}*
⏱ *Duration: ${videoDetails.lengthSeconds}*
📌 *Channel: ${videoDetails.author.name}*
📅 *Uploaded: ${videoDetails.uploadDate}*
🌍 *Url: ${videoDetails.video_url}*
🎬 *Description:* ${videoDetails.description}`,
            image: await this.client.util.fetchBuffer(videoDetails.thumbnails[0].url)
        })
        if (parseInt(videoDetails.lengthSeconds) > 600) return void (await M.reply('❌ Video is too long'))
        try {
            const data = await video.getBuffer()
            M.reply(data, 'video')
        } catch (e) {
            console.log(e)
            M.reply('❌ Failed to download video'.concat(typeof e === 'string' ? e : ''))
        }
    }
}
