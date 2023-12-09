import BaseCommand from '../../libs/BaseCommand.js'
import { Ship } from '@shineiichijo/canvas-chan'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'ship',
            category: 'fun',
            description: {
                content: 'Ships you',
                usage: '[@mention | [quote-message]]'
            },
            exp: 3
        })
    }

    exec = async (M) => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        while (M.mentioned.length < 2) M.mentioned.unshift(M.sender.jid)
        if (M.mentioned.includes(this.client.user.id)) return void (await M.reply("❌ You can't ship the bot"))
        const users = await Promise.all(
            M.mentioned.slice(0, 2).map(async (id) => {
                const { username } = await this.client.DB.getUserInfo(id)
                return {
                    name: username,
                    image: await this.client.util.fetchBuffer(
                        (await this.client.profilePictureUrl(id, 'image')) ??
                            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                    )
                }
            })
        )
        const level = this.level()
        let text = ''
        if (level >= 0 && level < 10) text = 'Awful'
        else if (level >= 10 && level < 25) text = 'Very Bad'
        else if (level >= 25 && level < 40) text = 'Poor'
        else if (level >= 40 && level < 55) text = 'Average'
        else if (level >= 55 && level < 75) text = 'Good'
        else if (level >= 75 && level < 90) text = 'Great'
        else if (level >= 90) text = 'Amazing'

        const image = await new Ship(users, level, text).build()
        return void (await M.replyRaw({
            image,
            caption: `\`\`\`🔺Compatibility Meter🔺\`\`\`
💖 *${users[0].name} x ${users[1].name}* 💖
*🔻 ${level} ${level < 50 ? '💔' : '💞'} ${text}* 🔻`
        }))
    }

    level = () => Math.floor(Math.random() * 100) + 1
}
