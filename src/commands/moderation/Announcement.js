import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'announcement',
            aliases: ['chat'],
            category: 'moderation',
            description: {
                content: 'Closes or opens the group'
            },
            adminOnly: true,
            perms: true,
            exp: 1
        })
    }

    exec = async (M) => {
        if (!M.group.metadata.announce) await this.client.groupSettingUpdate(M.from, 'announcement')
        if (M.group.metadata.announce) await this.client.groupSettingUpdate(M.from, 'not_announcement')
        return void (await M.reply(
            ` ${M.group.metadata.announce ? '🔇 Not_announcement' : '🔊 Announcement'} mode has been toggled in ${
                M.group.title
            } `
        ))
    }
}
