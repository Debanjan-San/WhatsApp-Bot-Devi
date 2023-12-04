import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'ban',
            category: 'dev',
            description: {
                content: 'Bans Users',
                usage: '--ban=true [quote] || --ban=false @user'
            },
            modsOnly: true,
            exp: 1
        })
    }

    exec = async (M, { flags, text }) => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender.jid)
        const keys = Object.keys(flags)
        if (!M.mentioned.length) return void (await M.reply('❌ Mention is required to Ban'))
        if (!keys.length) return void (await M.reply('❌ Sorry you are using a wrong format!'))
        const { ban, jid } = await this.client.DB.getUserInfo(M.mentioned[0])
        if (keys[0] !== 'ban') return void (await M.reply('❌ Invalid value'))
        if (flags[keys[0]].toLowerCase() == 'true' && ban) return void (await M.reply('🟨 User is banned already!'))
        if (flags[keys[0]].toLowerCase() == 'false' && !ban) return void (await M.reply('🟨 User is unbanned already!'))
        if (!['true', 'false'].includes(flags[keys[0]].toLowerCase())) return void (await M.reply('❌ Invalid value'))
        const reason = text
            .split(' ')
            .filter((word) => word !== M.mentioned[0])
            .filter((word) => !['--ban=true', '--ban=false'].includes(word))
            .join(' ')
        await Promise.all([
            await this.client.DB.user.set(
                `${M.mentioned[0]}.ban`,
                flags[keys[0]].toLowerCase() == 'false' ? false : true
            ),
            await this.client.DB.user.set(
                `${M.mentioned[0]}.reason`,
                flags[keys[0]].toLowerCase() == 'false' ? '' : reason
            )
        ])

        return void (await M.reply(
            `@${jid.split('@')[0]} has been banned ${flags[keys[0]].toLowerCase() == 'true' ? 'true 🟥' : 'false 🟩'}`,
            'text',
            undefined,
            undefined,
            [M.mentioned[0]]
        ))
    }
}
