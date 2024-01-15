import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'animenews',
            aliases: ['aninews'],
            category: 'weeb',
            description: {
                content: 'Gives you news about anime'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M) => {
        await this.client.util
            .fetch(`https://weeb-api.vercel.app/telegram/anime_news`)
            .then(async (results) => {
                if (!results.length) return void M.reply('🟥 Not news Found')
                for (const result of results) {
                    let msg = ''
                    msg += `📔 *Title: ${result.caption}*\n\n`
                    msg += `💾 *ID: ${result.id}*\n\n`
                    msg += `♨ *Views: ${result.views}*\n\n`
                    msg += `🕛 *Time: ${result.time} Per Ep.*\n\n`
                    msg += `🎞 *Link: ${result.url}*\n\n`
                    const image = await this.client.util.fetchBuffer(
                        result.mediaUrl ||
                            'https://wallpapers-clan.com/wp-content/uploads/2021/04/Anime-App-Icons-News.png'
                    )
                    await M.reply(image, 'image', undefined, msg)
                }
            })
            .catch(() => {
                return void M.reply(`❌ Error!`)
            })
    }
}
