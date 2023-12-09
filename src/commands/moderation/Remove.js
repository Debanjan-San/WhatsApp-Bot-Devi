import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'remove',
            category: 'moderation',
            description: {
                content: 'Remove one or more users',
                usage: '@user || [quote]'
            },
            adminOnly: true,
            perms: true,
            exp: 1
        })
    }

    exec = async (M) => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void (await M.reply(`❌ Mentions are required to remove`))
        if (M.mentioned.length > 5)
            return void (await M.reply(
                `❌ You can only remove up to 5 users at a time, Remove some users and try again`
            ))
        let text = '🏌️ Removing Users...\n'
        for (const jid of M.mentioned) {
            const number = jid.split('@')[0]
            if (M.group?.admins.includes(jid)) text += `\n🟨 Skipped *@${number}* as they are an admin`
            if (!M.group?.participants?.includes(jid)) text += `\n🟨 *@${number}* is not a participant`
            else {
                await this.client.groupParticipantsUpdate(M.from, [jid], 'remove')
                text += `\n✔️ Removed *@${number}*`
            }
        }
        return void (await M.reply(text, undefined, undefined, undefined, M.mentioned))
    }
}
