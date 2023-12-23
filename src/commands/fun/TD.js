import BaseCommand from '../../libs/BaseCommand.js'
import { get_truth, get_dare } from 'better-tord'
const options = ['truth', 'dare']

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'td',
            category: 'fun',
            aliases: [...options],
            description: {
                content: 'Gives you tuth and dare',
                usage: '[truth | dare] | td'
            },
            exp: 1
        })
    }

    exec = async (M, { cmd, text }) => {
        let caption
        if (options.includes(cmd)) caption = cmd === 'truth' ? get_truth() : get_dare()
        if (options.includes(text)) caption = text === 'truth' ? get_truth() : get_dare()
        else caption = this.client.util.getRandomItem(options) === 'truth' ? get_truth() : get_dare()
        return void (await M.reply(caption))
    }
}
