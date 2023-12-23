import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'lyrics',
            category: 'media',
            description: {
                content: 'Sends the lyrics of a given song',
                usage: '[search]'
            },
            dm: true,
            exp: 5
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void (await M.reply('❌ Please provide a search term'))
        const data = await client.util.fetch(`https://some-random-api.com/others/lyrics?title=${text}`)
        if (data.error) return void (await M.reply("❌ Couldn't find any lyrics"))

        return void (await M.replyRaw({
            text: `🎊 *Title: ${data.title}*\n🖋️ *Artist: ${data.author}*\n\n ${data.lyrics}`,
            contextInfo: {
                externalAdReply: {
                    title: data.title,
                    body: '',
                    thumbnail: await client.util.getBuffer(data.thumbnail.genius),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: '',
                    ShowAdAttribution: true
                }
            }
        }))
    }
}
