import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'ping',
            category: 'moderation',
            description: {
                content: 'Ping Members'
            },
            exp: 1
        })
    }

    exec = async (M, { flags, text }) => {
        if ('admins' in flags)
            return void (await M.reply('👤 *Pingind Admins*', 'text', undefined, undefined, M.group?.admins))

        if (!M.isAdminMessage) return void (await M.reply('❌ *You must be an admin to ping all users*'))
        return void (await M.reply(
            text ? `👥 *Pinging Everyone*\n\n*🔈 announcement :* ${text}` : '👥 *Pinging Everyone* ',
            'text',
            undefined,
            undefined,
            M.group?.participants
        ))
    }
}
