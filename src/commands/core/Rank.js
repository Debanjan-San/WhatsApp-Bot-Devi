import BaseCommand from '../../libs/BaseCommand.js'
import canvafy from 'canvafy'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'rank',
            category: 'core',
            description: {
                content: "View your/other's rank."
            },
            exp: 7
        })
    }

    exec = async (M) => {
        const { rank, level, exp, requiredXpToLevelUp } = await this.client.DB.getUserInfo(M.sender.jid, this.client)
        const url =
            (await this.client.profilePictureUrl(M.sender.jid, 'image').catch(() => null)) ??
            'https://static.wikia.nocookie.net/v__/images/7/73/Fuseu404notfound.png/revision/latest?cb=20171104190424&path-prefix=vocaloidlyrics'

        const image = await new canvafy.Rank()
            .setAvatar(await this.client.util.fetchBuffer(url))
            .setBackground(
                'image',
                'https://marketplace.canva.com/EAFIJOrGLJ8/1/0/1600w/canva-white-lime-green-slate-grey-sports-and-racing-sports-twitch-banner-yggpFT_kyBo.jpg'
            )
            .setUsername(M.sender.username)
            .setBorder('#2EC22E')
            .setStatus('online')
            .setLevel(level)
            .setCurrentXp(exp)
            .setRequiredXp(requiredXpToLevelUp)
            .build()

        return void (await M.replyRaw({
            caption: `
🏷️  *Username: ${M.sender.username}*

🏅 *Rank: ${rank}*

🪄  *Experience: ${exp}*

🏆 *Level: ${level}*
    `,
            image
        }))
    }
}
