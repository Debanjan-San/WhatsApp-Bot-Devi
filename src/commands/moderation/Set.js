import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'set',
            category: 'moderation',
            description: {
                content: 'Changes the group name/description',
                usage: '[name] --name|| [description/quote] --desc'
            },
            exp: 1
        })
    }

    exec = async (M, { flags, text }) => {
        const keys = Object.keys(flags)
        const responce = M.quoted?.message.conversation ? text : null
        if (!responce) return void M.reply('❌ Please provide a text!')
        if (!flags) return void M.reply('❌ Reply with a valid flag')
        if ('name' == keys[0]) {
            await this.client.groupUpdateSubject(M.from, responce.trim())
        } else if ('desc' == keys[0]) {
            await this.client.groupUpdateDescription(M.from, responce.trim())
        } else return void M.reply('❌ Reply with a valid flag')
    }
}
