import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'character',
            aliases: ['chara'],
            category: 'weeb',
            description: {
                content: 'Searches a character of the given query',
                usage: '[name]'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Sorry you did not give any query!'))
        await this.client.util
            .fetch(`https://weeb-api.vercel.app/character?search=${text}`)
            .then(async (data) => {
                if (!data.length) return void M.reply('Not Found - Invalid Input')
                let msg = ''
                msg += `🎀 *Full: ${data[0]?.name?.full}*\n\n`
                msg += `💮 *Japanese:* *${data[0]?.name?.native}*\n\n`
                msg += `💫 *Age: ${data[0]?.age}*\n\n`
                msg += `🚻 *Gender: ${data[0]?.gender}*\n\n`
                msg += `🩸 *Blood Type: ${data[0]?.bloodType}*\n\n`
                msg += `📃 *Description:* ${data[0]?.description.replace(/\([^)]*\)*/g, '')}`
                const image = await this.client.util.fetchBuffer(data[0]?.imageUrl)
                return void (await M.reply(image, 'image', undefined, msg))
            })
            .catch((err) => {
                console.log(err)
                return void M.reply(`❌ Couldn't find any character *"${text}"*`)
            })
    }
}
