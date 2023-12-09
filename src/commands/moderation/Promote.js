import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'promote',
            category: 'moderation',
            description: {
                content: 'Promote one or more users',
                usage: '@user || [quote]'
            },
            adminOnly: true,
            perms: true,
            exp: 1
        })
    }

    exec = async (M) => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void (await M.reply(`❌ Mentions are required to promote`))
        if (M.mentioned.length > 5)
            return void (await M.reply(
                `❌ You can only promote up to 5 users at a time, Remove some users and try again`
            ))
        let text = '🎖️ Promoting Users...\n'
        for (const jid of M.mentioned) {
            const number = jid.split('@')[0]
            if (M.group?.admins?.includes(jid)) text += `\n〽️ *@${number}* is already an admin`
            else {
                await this.client.groupParticipantsUpdate(M.from, [jid], 'promote')
                text += `\n✔️ Promoted *@${number}*`
            }
        }
        return void (await M.reply(text, undefined, undefined, undefined, M.mentioned))
    }
}
