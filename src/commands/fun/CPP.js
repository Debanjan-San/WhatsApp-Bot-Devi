import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'couplepp',
            aliases: ['cpp'],
            category: 'fun',
            description: {
                content: 'Sends a random couple pfp image'
            },
            exp: 3
        })
    }

    exec = async (M) => {
        return void (await M.reply('❌ NoT Working Right Now ;(!'))
        const responce = await this.client.util.fetch('https://smiling-hosiery-bear.cyclic.app/weeb/couplepp')
        Object.values(responce)
            .slice(2, 4)
            .forEach(async (url) => await M.reply(await this.client.util.fetchBuffer(url), 'image'))
    }
}
