import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'toggle',
            category: 'moderation',
            description: {
                content: 'Toggle Certain Settings',
                usage: '--[opetion]=true || --[opetion]=false'
            },
            adminOnly: true,
            exp: 1
        })
    }

    exec = async (M, { flags }) => {
        const keys = Object.keys(flags)
        if (!keys.length) {
            return void (await M.reply(
                `🔧 *Toggle Settings*

                ${this.settings
                    .map(
                        ({ name, description }) =>
                            `🟢 *${name}* - ${description}\nTo turn on *${this.client.config.prefix}toggle --${name}=true*\nTo turn off *${this.client.config.prefix}toggle --${name}=false*`
                    )
                    .join('\n\n')}
                `
            ))
        }

        if (!this.settings.map((x) => x.name).includes(keys[0])) return void (await M.reply('❌ Invalid setting'))
        if (!['true', 'false'].includes(flags[keys[0]].toLowerCase())) return void (await M.reply('❌ Invalid value'))
        const current = (await this.client.DB.group.get(M.from)) ?? {
            mods: false,
            events: false,
            nsfw: false,
            chatbot: false
        }
        if (flags[keys[0]] == 'true' && current[keys[0]])
            return void (await M.reply(`🟨 *${this.client.util.capitalize(keys[0])} is already enabled*`))
        if (flags[keys[0]] == 'false' && !current[keys[0]])
            return void M.reply(`🟨 *${this.client.util.capitalize(keys[0])} is already disabled*`)
        current[keys[0]] = !current[keys[0]]
        await this.client.DB.group.set(M.from, current)
        return void (await M.reply(
            `${flags[keys[0]] == 'true' ? '🟩 Enabled' : '🟥 Disabled'} *${this.client.util.capitalize(
                keys[0]
            )}* in this Group chat`
        ))
    }

    settings = [
        {
            name: 'mods',
            description:
                'Enables the bot to remove the member which sent an invite link for other group (will work if and only if the bot is admin).'
        },
        {
            name: 'events',
            description: 'If enabled, the bot will listen for group events like new members joining, leaving, etc.'
        },
        {
            name: 'nsfw',
            description: 'If enabled, the bot will give access this group to use all the NSFW commands.'
        },
        {
            name: 'chatbot',
            description: 'If enabled, bot will automatically in your chat'
        }
    ]
}
