import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'answer',
            aliases: ['ans'],
            category: 'game',
            description: {
                content: 'Answers to the question',
                usage: '[number]'
            },
            exp: 9
        })
    }

    exec = async (M) => {
        if (!this.handler.quiz.has(M.from)) return void (await M.reply('❌ There is no quiz going on'))
        if (!M.numbers.length) return void (await M.reply('❌ Sorry you did not give any answer!'))
        const { options, answer } = this.handler.quiz.get(M.from)
        if (options.length < M.numbers[0]) return void (await M.reply('❌ Sorry you did not give any valid answer!'))
        const data = this.handler.tried.get(M.from) || []
        if (data.includes(M.sender.jid)) return void (await M.reply('❌ You already tried this question try next time'))
        if (options[M.numbers[0] - 1] !== answer) {
            data.push(M.sender.jid)
            this.handler.tried.set(M.from, data)
            return void (await M.reply('❌ Wrong answer'))
        }
        this.handler.quiz.delete(M.from)
        this.handler.getQuiz(M.from)
        await M.reply('✔️ Correct answer')
    }
}
