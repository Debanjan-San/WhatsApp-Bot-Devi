import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'enable',
            category: 'dev',
            description: {
                content: 'Enable/disable the specified command',
                usage: '--[command]=true || --[command]=false'
            },
            modsOnly: true,
            exp: 1
        })
    }

    exec = async (M, { flags, text }) => {
        const keys = Object.keys(flags)
        if (!keys.length) return void (await M.reply('❌ Sorry you are using a wrong format!'))
        const command = this.handler.commands.get(keys[0]) || this.handler.aliases.get(keys[0])
        if (!command) return void (await M.reply('❌ Invalid value'))
        const cmdStatus = (await this.client.DB.command.get(command.config?.command)) ?? {
            isDisabled: false,
            reason: ''
        }
        if (flags[keys[0]].toLowerCase() == 'true' && cmdStatus.isDisabled)
            return void (await M.reply('🟨 Command is Disabled already!'))
        if (flags[keys[0]].toLowerCase() == 'false' && !cmdStatus.isDisabled)
            return void (await M.reply('🟨 Command is Enabled already!'))
        if (!['true', 'false'].includes(flags[keys[0]].toLowerCase())) return void (await M.reply('❌ Invalid value'))
        const reason = text
            .split(' ')
            .filter((word) => ![`--${keys[0]}=true`, `--${keys[0]}=false`].includes(word))
            .join(' ')

        await this.client.DB.command.set(command.config?.command, {
            isDisabled: flags[keys[0]].toLowerCase() == 'false' ? false : true,
            reason
        })

        return void (await M.reply(
            `The command ${command.config?.command} has been ${
                flags[keys[0]].toLowerCase() == 'true' ? 'Disabled 🟥' : 'Enabled 🟩'
            }`
        ))
    }
}
