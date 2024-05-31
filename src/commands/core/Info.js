import BaseCommand from '../../libs/BaseCommand.js'
import os from 'os'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'info',
            aliases: ['i'],
            category: 'core',
            description: {
                content: "Displays the bot's info"
            },
            dm: true,
            exp: 1
        })
    }

    exec = async (M) => {
        const cpus = os.cpus()
        return void (await M.reply(`🎋 *Users: ${(await this.client.DB.getAllUsers()).length}*
🎖️ *Groups: ${Object.keys(await this.client.groupFetchAllParticipating()).length}*
💬 *Platform: ${os.platform()}*
🌃 *Moderators: ${this.client.config.mods.length}*
🌀 *Commands: ${this.handler.commands.size}*
📚 *Cpu: ${cpus[0].model} ${cpus.length > 1 ? `(${cpus.length} core)` : ''}*`))
    }
}
