import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'join',
            category: 'dev',
            description: {
                content: 'For Super Users'
            },
            modsOnly: true,
            dm: true,
            exp: 1
        })
    }

    exec = async (M) => {
        if (!M.urls.length) return void (await M.reply('❌ Link?'))
        const url = M.urls.find((url) => url.includes('chat.whatsapp.com'))
        if (!url) return void (await M.reply('❌ No WhatsApp Invite URLs found in your message'))
        this.client
            .groupAcceptInvite(url.split('https://chat.whatsapp.com/')[1])
            .then((res) => M.reply('✔️ Joined chat'))
            .catch((res) => M.reply("❓ Cannot join group. Most likely, I've been removed from there previously"))
    }
}
