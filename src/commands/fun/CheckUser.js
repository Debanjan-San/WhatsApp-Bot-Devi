import BaseCommand from '../../libs/BaseCommand.js'
const options = [
    'awesomecheck',
    'greatcheck',
    'gaycheck',
    'cutecheck',
    'lesbiancheck',
    'hornycheck',
    'prettycheck',
    'lovelycheck',
    'uglycheck',
    'beautifulcheck',
    'handsomecheck',
    'charactercheck'
]

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'checkuser',
            category: 'fun',
            aliases: ['cu', ...options],
            description: {
                content: 'Checks on user',
                usage: '[mention user | quote user]'
            },
            exp: 1
        })
    }

    exec = async (M, { cmd }) => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        M.mentioned = [...new Set(M.mentioned)]
        if (!M.mentioned.length) M.mentioned.push(M.sender.jid)
        if (cmd === 'cu' || cmd == 'checkuser') {
            const checkList = `🎃 *Available Checks:*\n\n- ${options
                .map((check) => this.client.util.capitalize(check))
                .join('\n- ')}\n🔗  *Usage:* ${this.client.config.prefix}(check) [tag/quote user]\nExample: ${
                this.client.config.prefix
            }cutecheck`
            return void (await M.reply(checkList))
        }
        const types = [
            'Compassionate',
            'Generous',
            'Grumpy',
            'Forgiving',
            'Obedient',
            'Good',
            'Simp',
            'Kind-Hearted',
            'patient',
            'UwU',
            'top, anyway',
            'Helpful'
        ]
        const percentage = this.client.util.getRandomInt(0, 101)
        return void (await M.replyRaw({
            text: `🎆 _*${cmd.toUpperCase()}*_ 🎆\n\n @${M.mentioned[0].split('@')[0]} \`\`\`is ${
                cmd !== 'charactercheck'
                    ? `${percentage}% ${cmd.split('check')[0]}`
                    : `${percentage}% ${this.client.util.getRandomItem(types)}`
            }\`\`\``,
            mentions: [M.mentioned[0]]
        }))
    }
}
