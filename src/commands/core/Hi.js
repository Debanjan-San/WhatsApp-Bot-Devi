import BaseCommand from '../../lib/BaseCommand'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'hi',
            description: 'To test the bot',
            category: 'core',
            usage: `${client.config.prefix}hi`,
            dm: true
        })
    }

    exec = async (M) => {
        return void (await M.reply(`Hi ${M.sender.username}!`))
    }
}
