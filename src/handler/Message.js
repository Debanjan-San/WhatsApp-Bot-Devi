import { join } from 'path'
import { URL } from 'url'
import canvafy from 'canvafy'
export default class MessageHandler {
    commands = new Map()
    aliases = new Map()

    constructor(client) {
        this.client = client
    }

    handler = async (M) => {
        const context = this.parseArgs(M.content)
        const isCommand = M.content.startsWith(this.client.config.prefix)
        if (M.chat === 'group') this.moderate(M)
        if (!isCommand)
            return void this.client.log.notice(
                `(MSG): from ${M.sender.username ?? ''}  in ${M.group?.title || 'Direct Message'}`
            )
        const { cmd } = context
        const command = this.commands.get(cmd) || this.aliases.get(cmd)
        const user = await this.client.DB.getUserInfo(M.sender.jid, this.client)
        this.client.log.notice(`(CMD): ${cmd} from ${M.sender.username ?? ''} in ${M.group?.title || 'Direct Message'}`)
        if (!command) return void M.reply('💔 No Command Found! Try using one from the help list')
        const cmdStatus = (await this.client.DB.command.get(command.config?.command)) ?? {
            isDisabled: false,
            reason: ''
        }
        if (cmdStatus.isDisabled)
            return void M.reply(`🏮 This command has been disabled!\n📮 *Resason:* ${cmdStatus.reason}`)
        if (user.status.isBan)
            return void M.reply(`🚷 You\'re Banned from using commands\n📮 *Resason:* ${user.status.reason}`)
        if (!command.config?.dm && M.chat === 'dm') return void M.reply('💬 This command can only be used in groups')
        if (command.config?.modsOnly && !user.isMod) return void M.reply('👤 Only Mods are allowed to use this command')
        if (M.chat === 'group' && command.config?.adminOnly && !M.isAdminMessage)
            return void M.reply(`🔑 Only admins are allowed to use this command`)
        try {
            await command.exec(M, context)
            await this.client.DB.user.add(`${M.sender.jid}.exp`, command.config.exp)
            if (user.requiredXpToLevelUp < user.exp) {
                const url =
                    (await this.client.profilePictureUrl(M.sender.jid, 'image').catch(() => null)) ??
                    'https://static.wikia.nocookie.net/v__/images/7/73/Fuseu404notfound.png/revision/latest?cb=20171104190424&path-prefix=vocaloidlyrics'
                const image = await new canvafy.LevelUp()
                    .setAvatar(await this.client.util.fetchBuffer(url))
                    .setBackground(
                        'image',
                        'https://marketplace.canva.com/EAFIJGWz8q4/1/0/1600w/canva-red-black-white-anime-podcast-twitch-banner-UWLRt79y-g4.jpg'
                    )
                    .setUsername(M.sender.username)
                    .setBorder('#2EC22E')
                    .setAvatarBorder('#2EC22E')
                    .setOverlayOpacity(0.7)
                    .setLevels(user.level, user.level + 1)
                    .build()
                await this.client.DB.user.add(`${M.sender.jid}.level`, 1)
                await M.replyRaw({
                    caption: `🎆 ${M.sender.username} has leveled up to ${user.level + 1} from ${user.level}`,
                    image
                })
            }
        } catch (err) {
            return void this.client.log.error(err.message)
        }
    }

    moderate = async (M) => {
        if (!M.group.toggled.mods) return
        if (M.chat === 'dm') return
        if (!M.group?.admins.includes(this.client.util.sanitizeJid(this.client.user?.id ?? ''))) return
        if (M.isAdminMessage) return
        if (M.sender.isMod) return
        const urls = Array.from(this.client.util.getUrls(M.content))
        if (urls.length > 0) {
            const groupinvites = urls.filter((url) => url.includes('chat.whatsapp.com'))
            if (groupinvites.length > 0) {
                groupinvites.forEach(async (invite) => {
                    const code = await this.client.groupInviteCode(M.from)
                    const inviteSplit = invite.split('/')
                    if (inviteSplit[inviteSplit.length - 1] !== code) {
                        M.reply('Take care intruder and get some help!!')
                        await this.client.sendMessage(M.from, { delete: M.key })
                        return void (await this.client.groupParticipantsUpdate(M.from, [M.sender.jid], 'remove'))
                    }
                })
            }
        }
    }

    loadCommands = async () => {
        this.client.log.info('Loading Commands...')
        const __dirname = new URL('.', import.meta.url).pathname
        const path = join(__dirname, '..', 'commands')
        const files = this.client.util.readdirRecursive(path)
        for (const file of files) {
            const filename = file.split('/')
            if (!filename[filename.length - 1].startsWith('_')) {
                const command = new (Object.values(await import(file))[0])(this.client, this)
                this.commands.set(command.config.command, command)
                if (command.config.aliases) command.config.aliases.forEach((alias) => this.aliases.set(alias, command))
                this.client.log.info(`Loaded: ${command.config.command} from ${command.config.category}`)
            }
        }
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
