import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'delete',
            category: 'moderation',
            description: {
                content: 'Delete a message',
                usage: '[quote the message to delete]'
            },
            perms: true,
            exp: 1
        })
    }

    exec = async (M) => {
        if (!M.quoted) return void (await M.reply('❌ You need to quote a message to delete'))
        await this.client.sendMessage(M.from, {
            delete: M.quoted.message.key
        })
    }
}
