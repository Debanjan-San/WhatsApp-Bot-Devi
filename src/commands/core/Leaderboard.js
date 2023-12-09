import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'leaderboard',
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
        const totalParticipants = (await this.client.DB.user.all()).map((jid) => {
            return {
                jid: jid.id + '.whatsapp.net',
                username: jid.value.whatsapp.net.username ?? 'User',
                exp: jid.value.whatsapp.net.exp ?? 0,
                level: jid.value.whatsapp.net.level ?? 0
            }
        })
        const participants =
            keys[0] == 'guild'
                ? totalParticipants.filter((user) => M.group?.participants.includes(user.jid))
                : totalParticipants
        if (participants.length <= 10)
            return void (await M.reply("❌ You don't have enough participants to create a leaderboard"))
        const shortedParticipants = participants.sort((a, b) => b.exp - a.exp)
        let text = ''
        shortedParticipants.slice(0, 10).map((participant, i) => {
            text += `*${i + 1}. ${participant.username}*\n🌟 *Exp:* ${participant.exp}\n🏅 *Level:* ${
                participant.level
            }\n\n`
        })
        return void (await M.reply(text))
    }
}
