import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'manga',
            category: 'weeb',
            description: {
                content: 'Searches a manga of the given query',
                usage: '[name]'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Sorry you did not give any query!'))
        await this.client.util
            .fetch(`https://weeb-api.vercel.app/manga?search=${text}`)
            .then(async (data) => {
                if (!data.length) return void M.reply('Not Found - Invalid Input')
                let msg = ''
                msg += `🎀 *Name: ${data[0].title.english}*\n\n`
                msg += `👁️‍🗨️ *Romanji: ${data[0].title.romaji}*\n\n`
                msg += `💮 *Japanese: ${data[0].title.native}*\n\n`
                msg += `♨ *Type: ${data[0].format}*\n\n`
                msg += `🔞 *Is-Adult: ${data[0].isAdult}*\n\n`
                msg += `💫 *Status: ${data[0].status}*\n\n`
                msg += `🚥 *Chapters: ${data[0].chapters}*\n\n`
                msg += `🎭 *Volumes: ${data[0].volumes}*\n\n`
                msg += `🎐 *First Aired: ${data[0].startDate}*\n\n`
                msg += `🍥 *Last Aired: ${data[0].endDate}*\n\n`
                msg += `🧧 *Genres: ${data[0].genres.join(', ')}*\n\n`
                msg += `🎞 *Trailer: https://youtu.be/${data[0].trailer ? data[0].trailer.id : 'null'}*\n\n`
                msg += `📃 *Description:* ${data[0].description}`
                const image = await this.client.util.fetchBuffer(data[0].imageUrl)
                return void (await M.reply(image, 'image', undefined, msg))
            })
            .catch(() => {
                return void M.reply(`❌ Couldn't find any manga *"${text}"*`)
            })
    }
}
