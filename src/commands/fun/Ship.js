import BaseCommand from '../../libs/BaseCommand.js'
import canvafy from 'canvafy'

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
        try {
            if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
            while (M.mentioned.length < 2) M.mentioned.unshift(M.sender.jid)
            if (M.mentioned.includes(this.client.user.id)) return void (await M.reply("❌ You can't ship the bot"))
            const images = await Promise.all(
                M.mentioned.slice(0, 2).map(async (id) => {
                    return {
                        jid: id,
                        image: await this.client
                            .profilePictureUrl(id, 'image')
                            .catch(
                                () =>
                                    'https://static.wikia.nocookie.net/v__/images/7/73/Fuseu404notfound.png/revision/latest?cb=20171104190424&path-prefix=vocaloidlyrics'
                            )
                    }
                })
            )
            const level = Math.floor(Math.random() * 100) + 1
            const ratings = ['Awful', 'Very Bad', 'Poor', 'Average', 'Good', 'Great', 'Amazing']
            const image = await new canvafy.Ship()
                .setAvatars(images[0].image, images[1].image)
                .setBackground('image', 'https://i.pinimg.com/originals/8b/22/7e/8b227ee6d17a97b4f867b506bbd99c81.jpg')
                .setBorder('#FF0000')
                .setCustomNumber(level)
                .setOverlayOpacity(0.5)
                .build()
            return void (await M.replyRaw({
                image,
                mentions: images.map((i) => i.jid),
                caption: `\`\`\`🔺Compatibility Meter🔺\`\`\`
💖 *${images.map((user) => `@${user.jid.split('@')[0]}`).join(' X ')}* 💖
*🔻 ${level} ${level < 50 ? '💔' : '💞'} ${ratings[Math.floor(level / 15)]}* 🔻`
            }))
        } catch (e) {
            console.error(e)
        }
    }
}
