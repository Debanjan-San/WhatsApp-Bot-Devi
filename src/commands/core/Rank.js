import BaseCommand from '../../libs/BaseCommand.js'
import { getRank, ranks } from '../../libs/Ranks.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'rank',
            category: 'core',
            description: {
                content: 'View your rank.'
            },
            exp: 7
        })
    }

    exec = async (M) => {
        const { exp } = await this.client.DB.getUserInfo(M.sender.jid)
        const url =
            (await this.client.profilePictureUrl(M.sender.jid, 'image').catch(() => null)) ??
            'https://static.wikia.nocookie.net/v__/images/7/73/Fuseu404notfound.png/revision/latest?cb=20171104190424&path-prefix=vocaloidlyrics'

        const { name, data } = getRank(exp)
        const nextRank = (() => {
            const keys = Object.keys(ranks)
            const i =
                keys.find((x) => {
                    return ranks[x].exp > exp
                }) ?? 'Recruit'
            return getRank(ranks[i].exp)
        })()

        return void (await M.replyRaw({
            text: `
🏷️  *Username: ${M.sender.username}*

🪄 *Experience: ${exp}*

🏆 *Rank: ${name} ${data.emoji}*

🍥 *Next Rank: ${nextRank.name} ${nextRank.data.emoji} (${nextRank.data.exp - exp} exp required)*
    `,
            contextInfo: {
                externalAdReply: {
                    title: `${M.sender.username ?? ''}'s Rank`,
                    body: ``,
                    thumbnail: await this.client.util.fetchBuffer(url),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://github.com/Debanjan-San/WhatsApp-Bot-Devi.git',
                    ShowAdAttribution: true
                }
            }
        }))
    }
}
