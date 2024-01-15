import BaseCommand from '../../libs/BaseCommand.js'
import { Reaction, reactions } from '../../utils/Reaction.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'reaction',
            aliases: [...reactions],
            category: 'fun',
            description: {
                content: "React to someone's message with a gif specified by the user.",
                usage: '[quote | [@mention]]'
            },
            exp: 5
        })
    }

    exec = async (M, { cmd }) => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        M.mentioned = [...new Set(M.mentioned)]
        if (!M.mentioned.length) M.mentioned.push(M.sender.jid)
        if (cmd === 'reaction' || cmd === 'r') {
            const reactionList = `💫 *Available Reactions:*\n\n- ${reactions
                .map((reaction) => this.client.util.capitalize(reaction))
                .join('\n- ')}\n🔗  *Usage:* ${this.client.config.prefix}(reaction) [tag/quote user]\nExample: ${
                this.client.config.prefix
            }pat`
            return void (await M.reply(reactionList))
        }

        const single = M.mentioned[0] === M.sender.jid
        const { url, words } = await new Reaction().getReaction(cmd, single)
        return void (await M.replyRaw({
            video: await this.client.util.fetchBuffer(url),
            gifPlayback: true,
            caption: `*@${M.sender.jid.split('@')[0]} ${words} ${
                single ? 'Themselves' : `@${M.mentioned[0].split('@')[0]}`
            }*`,
            mentions: [M.sender.jid, M.mentioned[0]]
        }))
    }
}
