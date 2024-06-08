import BaseCommand from '../../libs/BaseCommand.js'
import { ranks } from '../../libs/Ranks.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'ranks',
            category: 'core',
            description: {
                content: 'View available ranks.'
            },
            dm: true,
            exp: 7
        })
    }

    exec = async (M) => {
        const keys = Object.keys(ranks)
        const text = `🔧 *Ranks*

🌟 *Ranks are a way to display a user's progress in the bots Ecosystem*
💚 *Ranking is based on the amount of Experience points a user has earned*

${keys
    .map(
        (x) =>
            `${ranks[x].emoji} *${x}*\n*Required Exp: ${ranks[x].exp}*\n`
    )
    .join('\n')}
        `
        return void (await M.reply(text))
    }
}
