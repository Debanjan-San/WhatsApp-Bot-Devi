import BaseCommand from '../../libs/BaseCommand.js'
import yts from 'yt-search'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'ytsearch',
            aliases: ['yts'],
            category: 'media',
            description: {
                content: 'Get search results from youtube',
                usage: '[search]'
            },
            dm: true,
            exp: 5
        })
    }

    exec = async (M, { text }) => {
        if (!text.trim()) return void (await M.reply('❌ Please provide a search term'))
        const { videos } = await yts(text)
        if (!videos.length) return void (await M.reply('❌ No results found'))
        let msg = ''
        videos.forEach((video, i) => {
            const { title, author, url, timestamp } = video
            msg += `*#${i + 1}*\n📗 *Title: ${title}*\n📕 *Channel: ${
                author.name
            }*\n📙 *Duration: ${timestamp}s*\n🔗 *URL: ${url}*\n\n`
        })

        return void (await M.reply(msg))
    }
}
