import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'startquiz',
            category: 'game',
            aliases: ['quiz'],
            description: {
                content: 'Starts quiz',
                usage: '[number]'
            },
            exp: 9
        })
    }

    exec = async (M) => {
        const count = this.handler.count.get(M.from) ?? 0
        if (count !== 0) return void (await M.reply('❌ There is a quiz going on, try again later'))
        if (!M.numbers.length) return void (await M.reply('❌ Sorry you did not give any query!'))
        this.handler.count.set(M.from, M.numbers[0])
        this.handler.getQuiz(M.from)
    }
}
