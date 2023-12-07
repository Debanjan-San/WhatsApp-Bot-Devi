import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'eval',
            category: 'dev',
            aliases: ['run'],
            description: {
                content: 'For Super Users',
                usage: '[codes]'
            },
            modsOnly: true,
            dm: true,
            exp: 1
        })
    }

    exec = async (M, { text }) => {
        let out
        try {
            const output = (await eval(text)) || 'Executed Sucessfully!'
            console.log(output)
            out = JSON.stringify(output)
        } catch (err) {
            console.log(err)
            out = err?.message || 'An Error Occured. See your console for more info'
        }
        return void (await M.reply(out))
    }
}
