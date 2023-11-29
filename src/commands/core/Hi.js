import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'hi',
            category: 'core',
            description: {
                content: 'Say hello to the bot.'
            },
            dm: true,
            exp: 1
        })
    }

    exec = async (M) => {
        await M.reply(`Hi ${M.sender.username}!`)
    }
}
