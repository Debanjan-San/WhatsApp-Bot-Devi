import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'google',
            category: 'search',
            description: {
                content: 'Searches term from google.com',
                usage: '[text]'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Sorry you did not give any query!'))
        await this.client.util
            .fetch(
                `https://www.googleapis.com/customsearch/v1?q=${text}&key=AIzaSyABA9H2sDYVwY0sDE7bqYUxihdixoL3ozM&cx=baf9bdb0c631236e5`
            )
            .then((res) => {
                let result = ''
                let index = 1
                for (const item of res?.items) {
                    result += `*📗 ${index}.Title: ${item.title}*\n*🔗 Link: ${item.link}*\n*📖Snippet: ${item.snippet}*\n\n`
                    index++
                }
                return void M.reply(result)
            })
            .catch((err) => {
                return void M.reply(`🔍 Error: ${err}`)
            })
    }
}
