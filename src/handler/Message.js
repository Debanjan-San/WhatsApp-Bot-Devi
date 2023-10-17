import { join } from 'path'
export default class MessageHandler {
    commands = new Map()
    aliases = new Map()

    constructor(client) {}

    handle = async (M) => {
        const inText = this.client.util.format('In: ', M.group?.title || 'Direct Message')
        const args = this.parseArgs(M.content)
        if (!args.command) return
        if (!args.command.startsWith(this.client.config.prefix))
            return this.client.log.notice(`Message From: `, M.sender.username, inText)
        args.command = args.command.slice(this.client.config.prefix.length)
        this.client.log.info(`Command From`, M.sender.username, inText)
        const command = this.commands.get(args.command) || this.aliases.get(args.command)
        if (!command) return void M.reply(`Command \`${args.command}\` not found.`)
        if (command.options.group && !M.group) return void M.reply(`Command \`${command.id}\` is a group command.`)
        if (command.options.group && command.options.admin && !M.isAdminMessage)
            return void M.reply(`Command \`${command.id}\` is a group command and requires admin permissions.`)
        if (command.options.mod && !M.sender.isMod) return void M.reply(`Command \`${command.id}\` is a mod command.`)
        this.execute(command, M, args)
    }

    loadCommands = () => {
        this.client.log.info('Loading Commands...')
        const path = join(__dirname, '..', 'commands')
        const files = this.client.util.readdirRecursive(path)
        files.map((file) => {
            const filename = file.split('/')
            if (!filename[filename.length - 1].startsWith('_')) {
                const command = new (require(file).default)(this.client, this)
                this.commands.set(command.config.command, command)
                if (command.config.aliases) command.config.aliases.forEach((alias) => this.aliases.set(alias, command))
                this.client.log.info(`Loaded: ${command.config.command} from ${file}`)
                return command
            }
        })
        this.client.log.notice(`Successfully Loaded ${this.commands.size} Commands`)
    }

    parseArgs = (raw) => {
        const args = raw.split(' ')
        const cmd = args.shift()?.toLocaleLowerCase().slice(this.client.config.prefix.length) ?? ''
        const text = args.join(' ')
        const flags = {}
        for (const arg of args) {
            if (arg.startsWith('--')) {
                const [key, value] = arg.slice(2).split('=')
                flags[key] = value
            } else if (arg.startsWith('-')) {
                flags[arg] = ''
            }
        }
        // prettier-ignore
        return { cmd, text, flags, args, raw }
    }
}
