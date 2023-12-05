import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'help',
            aliases: ['menu', 'h'],
            category: 'core',
            description: {
                content: 'Displays the menu',
                usage: '[command]'
            },
            dm: true,
            exp: 1
        })
    }

    exec = async (M, parsedArgs) => {
        if (!parsedArgs.text) {
            const commands = this.handler.commands.keys()
            const categories = {}
            for (const command of commands) {
                const info = this.handler.commands.get(command)
                if (!command) continue
                if (!info?.config?.category || info.config.category === 'dev') continue
                if (Object.keys(categories).includes(info.config.category)) categories[info.config.category].push(info)
                else {
                    categories[info.config.category] = []
                    categories[info.config.category].push(info)
                }
            }
            let text = `🎫 *${this.client.config.name} Command List* 🎫\n\n`
            const keys = Object.keys(categories)
            for (const key of keys)
                text += `${this.emojis[keys.indexOf(key)]} *${key.toUpperCase()}*\n❐ \`\`\`${categories[key]
                    .map((command) => command.config?.command)
                    .join(', ')}\`\`\`\n\n`

            return void M.replyRaw({
                text: `${text}*📗 Note: You can get a brief detail of the command by using _${this.client.config.prefix}help <command name>_*\n\n🔰 *Usage: ${this.client.config.prefix}help anime*`,
                contextInfo: {
                    externalAdReply: {
                        title: `${this.client.config.name}'s Commands`,
                        body: '',
                        thumbnail: await this.client.util.fetchBuffer('https://i.imgur.com/22WppSh.jpg'),
                        mediaType: 1,
                        mediaUrl: '',
                        sourceUrl: '',
                        ShowAdAttribution: true
                    }
                }
            })
        }
        const key = parsedArgs.text.toLowerCase()
        const command = this.handler.commands.get(key) || this.handler.aliases.get(key)
        if (!command) return void (await M.reply(`❌ No Command of Alias Found *"${key}"*`))
        const cmdStatus = (await this.client.DB.command.get(command.config?.command)) ?? {
            isDisabled: false,
            reason: ''
        }
        return void (await M.reply(`🟥 *Command: ${command.config.command}*
🟧 *Category: ${command.config.category}*
🟨 *Aliases: ${command.config?.aliases.join(', ').trim() ?? 'None'}*
🟩 *PrivateChat: ${command.config.dm ? 'True' : 'False'}*
🟦 *Admin: ${command.config.adminOnly ? 'True' : 'False'}*
⬛ *Status: ${cmdStatus.isDisabled}* - ${cmdStatus.reason}
🟪 *Usage: ${this.client.config.prefix}${command.config.command} ${command.config.description.usage ?? ''}*
⬜ *Description: ${command.config.description?.content}*`))
    }

    emojis = ['🌀', '🎴', '🔮', '👑', '🎈', '⚙️', '🍀']
}
