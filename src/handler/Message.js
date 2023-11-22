import { join } from 'path'
const __dirname = path.resolve()

export default class MessageHandler {
    /**
     * @param {client} client
     */
    constructor(client) {
        /**
         * @type {Client}
         */
        this.client = client
    }

    /**
     * @param {Message} M
     * @returns {Promise<void>}
     */

    handler = async (M) => {
        const { prefix } = this.client.config
        const args = M.content.split(' ')
        const title = M.chat === 'group' ? M.group?.title || 'Group' : 'DM'
        if (!args[0] || !args[0].startsWith(prefix))
            return void this.client.log.notice(`Message from ${M.sender.username} in ${title}`)
        this.client.log(`(CMD): ${args[0]}[${args.length - 1}])} from ${M.sender.username} in ${title}`)
        const cmd = args[0].toLowerCase().slice(prefix.length)
        const command = this.commands.get(cmd) || this.aliases.get(cmd)
        if (!command) return void M.reply('No Command Found! Try using one from the help list.')
        if (M.chat === 'dm' && !command.config?.dm) return void M.reply('This command can only be used in groups')
        if (M.chat === 'group' && command.config?.adminOnly && !M.isAdminMessage)
            return void M.reply(`Only admins are allowed to use this command`)
        try {
            await command.exec(M, this.parseArgs(args))
        } catch (err) {
            return void this.client.log.error(err.message)
        }
    }

    loadCommands = () => {
        this.client.log.info('Loading Commands...')
        const path = join(__dirname, '..', 'commands')
        const files = this.client.util.readdirRecursive(path)
        files.map((file) => {
            const filename = file.split('/')
            if (!filename[filename.length - 1].startsWith('_')) {
                const command = new (await import(path)).default(this.client, this)
                this.commands.set(command.config.command, command)
                if (command.config.aliases) command.config.aliases.forEach((alias) => this.aliases.set(alias, command))
                this.client.log.info(`Loaded: ${command.config.command} from ${file}`)
                return command
            }
        })
        this.client.log.notice(`Successfully Loaded ${this.commands.size} Commands`)
    }

    /**
     * @type {Map<string, Command>}
     */

    commands = new Map()

    /**
     * @type {Map<string, Command>}
     */

    aliases = new Map()

    /**
     * @private
     * @param {string[]} args
     * @returns {args}
     */

    parseArgs = (args) => {
        const cmd = args[0].toLowerCase().slice(this.client.config.prefix.length).trim()
        args.splice(0, 1)
        return {
            cmd,
            args,
            text: args.join(' ').trim(),
            flags: args.filter((arg) => arg.startsWith('--'))
        }
    }
}
