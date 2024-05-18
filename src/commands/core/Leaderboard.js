import BaseCommand from '../../libs/BaseCommand.js'
import { getRank } from '../../libs/Ranks.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'leaderboard',
            aliases: ['lb'],
            category: 'core',
            description: {
                content: 'Give a leaderboard of Xp',
                usage: '--guild'
            },
            exp: 1
        })
    }

    exec = async (M, { flags }) => {
        const keys = Object.keys(flags)
        const totalParticipants = (await this.client.DB.getAllUsers()).map((user) => {
            const { name, data } = getRank(user.exp ?? 0)
            return {
                jid: user.jid,
                exp: user.exp ?? 0,
                rank: `${name} ${data.emoji}`
            }
        })
        const participants =
            keys[0] == 'guild'
                ? totalParticipants.filter((user) => M.group?.participants.includes(user.jid))
                : totalParticipants
        if (participants.length <= 10)
            return void (await M.reply("❌ You don't have enough participants to create a leaderboard"))
        const shortedParticipants = participants.sort((a, b) => b.exp - a.exp)
        const topTenMembers = shortedParticipants.slice(0, 10)
        const jids = new Array()
        let text = topTenMembers
            .map((participant, i) => {
                jids.push(participant.jid)
                return `${this.emojis[i]} *@${participant.jid.split('@')[0]}*\n🌟 *Exp: ${
                    participant.exp
                }*\n🍥 *Rank: ${participant.rank}*`
            })
            .join('\n\n')
        return void (await M.reply(text, 'text', undefined, undefined, jids))
    }

    emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
}
