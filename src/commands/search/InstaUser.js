import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'instauser',
            aliases: ['istastalk'],
            category: 'search',
            description: {
                content: 'Get info of the given insta user',
                usage: '[username]'
            },
            dm: true,
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        if (!text) return void M.reply('❌ Please provide a username')
        const data = await this.client.util.fetch(`https://weeb-api.vercel.app/insta?username=${text}`)
        if (data.error) return void (await M.reply('❌ Not Found'))
        return void (await M.reply(
            await this.client.util.fetchBuffer(data.profileUrl),
            'image',
            undefined,
            `📛 *Username: ${data.username}*

◻️ *Name: ${data.name}*

💭 *Type: ${data.type}*

👥 *Followers: ${data.followers}*

⛩ *Following: ${data.following}*

💮 *Bio:* ${data.bio}`
        ))
    }
}
