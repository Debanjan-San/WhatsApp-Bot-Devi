import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'mods',
            aliases: ['moderators', 'operators'],
            category: 'core',
            description: {
                content: "View bot's Moderators"
            },
            dm: true,
            exp: 4
        })
    }

    exec = async (M) => {
        const { mods } = this.client.config
        return void (await M.reply(
            [`🌃 *_MODERATORS_* 🌃 `, '\n', mods.map((x) => '@'.concat(x.split('@')[0])).join('\n')].join('\n'),
            'text',
            undefined,
            undefined,
            mods
        ))
    }
}
