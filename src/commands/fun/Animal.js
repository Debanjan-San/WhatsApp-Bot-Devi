import BaseCommand from '../../libs/BaseCommand.js'
const options = ['bird', 'cat', 'dog', 'fox', 'koala', 'panda']

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'animal',
            category: 'fun',
            aliases: [...options],
            description: {
                content: 'Sends random facts about animals'
            },
            exp: 1
        })
    }

    exec = async (M, { cmd }) => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        M.mentioned = [...new Set(M.mentioned)]
        if (!M.mentioned.length) M.mentioned.push(M.sender.jid)
        if (cmd === 'animal') {
            const checkList = `🐱 *Available Animal Fact:*\n\n- ${options
                .map((check) => this.client.util.capitalize(check))
                .join('\n- ')}\n🔗  *Usage:* ${this.client.config.prefix}(animal)\nExample: ${
                this.client.config.prefix
            }cat`
            return void (await M.reply(checkList))
        }
        const { fact } = await this.client.util.fetch(`https://some-random-api.com/facts/${cmd}`)
        const { link } = await this.client.util.fetch(`https://some-random-api.com/img/${cmd}`)
        return void (await M.replyRaw({
            image: await this.client.util.fetchBuffer(link),
            caption: `*_${fact}_*`
        }))
    }
}
