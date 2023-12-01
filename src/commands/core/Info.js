import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'info',
            aliases: ['i'],
            category: 'core',
            description: {
                content: "Displays the bot's info"
            },
            exp: 1
        })
    }

    exec = async (M) => {
        let text = `🎋 *Users: ${(await this.client.DB.getAllUsers()).length}*\n\n`
        text += `🎖️ *Groups: ${Object.keys(await this.client.groupFetchAllParticipating()).length}*\n\n`
        text += `🌃 *Moderators: ${this.client.config.mods.length}*\n\n`
        text += `🌀 *Commands: ${this.handler.commands.size}*`
        await M.reply(text)
    }
}
