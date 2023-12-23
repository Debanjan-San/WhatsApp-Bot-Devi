import BaseCommand from '../../libs/BaseCommand.js'
import YT from '../../utils/YT.js'
import yts from 'yt-search'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'play',
            category: 'media',
            description: {
                content: 'Plays Audio from Youtube',
                usage: '[song name]'
            },
            dm: true,
            exp: 5
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Please provide a song name'))
        const { videos } = await yts(text)
        if (!videos || !videos.length) return void M.reply('❌ No matching songs found')
        const video = new YT(videos[0].url, 'audio')
        const { videoDetails } = await video.getInfo()
        if (parseInt(videoDetails.lengthSeconds) > 600) return void (await M.reply('❌ Audio is too long'))
        try {
            return void (await M.replyRaw({
                audio: await video.download(),
                mimetype: 'audio/mp4',
                fileName: videoDetails.title
            }))
        } catch (e) {
            return void (await M.reply('❌ Failed to download Audio '.concat(typeof e === 'string' ? e : '')))
        }
    }
}
