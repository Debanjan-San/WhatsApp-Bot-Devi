import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'broadcast',
            aliases: ['bc'],
            category: 'dev',
            description: {
                content: 'Will make a broadcast for groups'
            },
            modsOnly: true,
            dm: true,
            exp: 1
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Sorry you did not give any text!'))
        const groups = Object.keys(await this.client.groupFetchAllParticipating())
        for (const group of groups) {
            const msg = `🏮 *「 ${this.client.config.name.toUpperCase()} BROADCAST 」* 🏮\n\n📮 ${text}\n\n`
            await this.client.sendMessage(group, {
                text: msg
            })
        }
    }
}
