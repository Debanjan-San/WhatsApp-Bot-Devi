import BaseCommand from '../../libs/BaseCommand.js'
import RedditFetcher from '../../utils/RedditFetcher.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'subreddit',
            aliases: ['sr', 'reddit', 'subred'],
            category: 'search',
            description: {
                content: 'Sends post from reddit',
                usage: '[reddit]'
            },
            dm: true,
            exp: 5
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Please provide a search term'))
        const reddit = await new RedditFetcher(text).fetch()
        if (reddit.error) return await void M.reply('❌ Invalid Subreddit')
        const { url, nsfw, spoiler, title, author, subreddit, postLink } = reddit
        if (nsfw && !M.group.toggled.nsfw)
            return void M.reply("🔞 Cannot display NFSW content as the group hasn't enabled NSFW")
        if (spoiler) await M.reply('⚠ *SPOILER WARNING* ⚠')
        const urlSplit = url.split('.')
        const caption = `🖌️ *Title: ${title}*\n*👨‍🎨 Author: ${author}*\n*🎏 Subreddit: ${subreddit}*`
        let buffer = await this.client.util.fetchBuffer(url)
        const gif = urlSplit[urlSplit.length - 1] === 'gif'
        if (gif) buffer = await this.client.util.gifToMp4(buffer)
        const type = gif ? 'video' : 'image'
        return void (await M.replyRaw({
            [type]: buffer,
            gifPlayback: gif ? true : undefined,
            caption,
            contextInfo: {
                externalAdReply: {
                    title,
                    sourceUrl: postLink,
                    thumbnail: buffer,
                    mediaType: 1
                }
            }
        }))
    }
}
