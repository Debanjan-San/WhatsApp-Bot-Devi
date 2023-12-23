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
        if (!text) return void M.reply('❌ Please provide a word')
        const query = text.trim()
        const { list } = await this.client.util.fetch(`https://api.urbandictionary.com/v0/define?term=${query}`)
        if (!list.length) return void (await M.reply('❌ Not Found'))
        let Text = `📚 *UrbanDictionary: _"${query}"_*`
        Text += `\n\n📖 *Definition: ${list[0]?.definition}*`
        Text += `\n\n💬 *Example: ${list[0]?.example}*`
        return void (await M.reply(Text.replace(/\[+|\]+/g, '')))
    }
}
