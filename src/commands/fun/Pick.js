import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'pick',
            category: 'fun',
            description: {
                content: 'Picks random users from a guild'
            },
            exp: 1
        })
    }

    exec = async (M, { text }) => {
        const randomMem = this.client.util.getRandomItem(M.group?.participants)
        return void (await M.replyRaw({
            text: `😛 ${text ? `*${text}:*` : '*Random_Pick:*'} @${randomMem.split('@')[0]}`,
            mentions: [randomMem]
        }))
    }
}
