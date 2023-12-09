import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'forfeit-quiz',
            category: 'game',
            aliases: ['ff-quiz', 'quiz-ff'],
            description: {
                content: 'Forfeits the ongoing quiz'
            },
            exp: 2
        })
    }

    exec = async (M) => {
        const count = this.handler.count.get(M.from) ?? 0
        if (count == 0) return void (await M.reply('❌ There is no quiz going on'))
        this.handler.count.set(M.from, 0)
        this.handler.quiz.delete(M.from)
        return void (await M.reply('✔️ The quiz has been deleted'))
    }
}
