import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'group',
            aliases: ['groupinfo', 'gcinfo'],
            category: 'core',
            description: {
                content: 'Get information about the group.'
            },
            exp: 7
        })
    }

    exec = async (M) => {
        const url =
            (await this.client.profilePictureUrl(M.from).catch(() => null)) ??
            'https://media.istockphoto.com/photos/abstract-handpainted-art-background-on-canvas-picture-id1134512518?b=1&k=20&m=1134512518&s=170667a&w=0&h=Rw8w1wEksVA2Her6kJMTkbD8Lp-8n3pZqEa-rDJaKfI='

        return void (await M.replyRaw({
            image: { url },
            jpegThumbnail: (await this.client.util.fetchBuffer(url)).toString('base64'),
            contextInfo: {
                externalAdReply: {
                    title: `${M.group?.metadata.subject ?? 'N/A'}'s Infomation`,
                    body: '',
                    thumbnail: await this.client.util.fetchBuffer(url),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: '',
                    ShowAdAttribution: true
                }
            },
            caption: `🏷️ *Group Subject: ${M.group?.metadata.subject ?? 'N/A'}*

🎖️ *Admins: ${M.group?.admins.length ?? 0}*

📋 *Total Members: ${M.group?.participants.length ?? 0}*
        
🍃 *Events: ${M.group.events ? 'Enabled' : 'Disabled'}*

⚡ *Mods: ${M.group.toggled.mods ? 'Enabled' : 'Disabled'}*

🔞 *Nsfw: ${M.group.toggled.nsfw ? 'Enabled' : 'Disabled'}*

🤖 *Chatbot: ${M.group.toggled.chatbot ? 'Enabled' : 'Disabled'}*

🌌 *Description:*
        
${M.group?.metadata.desc ?? 'N/A'}`
        }))
    }
}
