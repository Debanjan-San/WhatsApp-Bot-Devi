import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'define',
            aliases: ['ud'],
            category: 'search',
            description: {
                content: 'Gives you the definition of the given word',
                usage: '[text]'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Sorry you did not give any query!'))
        await this.client.util
            .fetch(`https://api.urbandictionary.com/v0/define?term=${text}`)
            .then((response) => {
                const msg = `📚 *Urban dictionary:* ${text}\n\n📖 *Definition:* ${response.list[0].definition
                    .replace(/\[/g, '')
                    .replace(/\]/g, '')}\n\n💬 *Example:* ${response.list[0].example
                    .replace(/\[/g, '')
                    .replace(/\]/g, '')}`
                return void M.reply(msg)
            })
            .catch((err) => {
                return void M.reply(`Sorry, couldn't find any definition related to *${text}*`)
            })
    }
}
