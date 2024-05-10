import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'tictactoe',
            category: 'game',
            aliases: ['ttt'],
            description: {
                content: 'Tic-Tac-Toe game with bot!',
                usage: '[option]'
            },
            exp: 9
        })
    }

    exec = async (M, { text }) => {
        try {
            if (!text)
                return void (await M.reply(
                    `❌ *Tic-Tac-Toe* ⭕ Commands\n\n🎗️ *${this.client.config.prefix}tictactoe challenge [tag/quote]* - Challenges the tagged or quoted person or bot for a match\n\n🎀 *${this.client.config.prefix}tictactoe accept* - Accepts the challenge if anyone challenged you for a match\n\n🔰 *${this.client.config.prefix}tictactoe reject* - Rejects the incoming challenge\n\n💠 *${this.client.config.prefix}tictactoe mark* - Marks your place in the board of the game\n\n♻ *${this.client.config.prefix}tictactoe forfeit* - Forfeits the ongoing game`
                ))
            let board = ['', '', '', '', '', '', '', '', '']
            const options = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
            let taken = []
            const term = text.toLowerCase().trim().split(' ')
            switch (term[0]) {
                default:
                    return void (await M.reply(
                        `Invalid Usage Format. Use *${this.client.config.prefix}tictactoe* for more info`
                    ))

                case 'c':
                case 'challenge':
                    if (this.ongoing.has(M.from) || this.challenges.has(M.from))
                        return void (await M.reply(`A game session is already going on`))
                    if (M.quoted && !M.mentioned.includes(M.quoted.sender)) M.mentioned.push(M.quoted.sender)
                    if (!M.mentioned.length || M.mentioned['length'] < 1)
                        return void (await M.reply('Tag or quote a user to challenge'))
                    const user = M.mentioned[0]
                    if (user === M.sender.jid) return void (await M.reply("You can't challenge yourself, Baka!"))
                    this.challenges.set(M.from, {
                        challenger: M.sender.jid,
                        challengee: user
                    })
                    if (user == this.client.util.sanitizeJid(this.client.user?.id ?? '')) {
                        this.ongoing.set(M.from, {
                            players: [user, M.sender.jid]
                        })
                        this.game.set(M.from, {
                            lastMarked: user,
                            board,
                            taken
                        })

                        return void (await M.reply(
                            await this.client.util.fetchBuffer('https://i.ibb.co/1qsdHcL/tic-tac-toe.png'),
                            'image',
                            undefined,
                            `Game Started!\n❌ - *@${M.sender.jid.split('@')[0]}*\n⭕ - *@${user.split('@')[0]}*`,
                            [user, M.sender.jid]
                        ))
                    } else {
                        return void (await M.reply(
                            `*@${M.sender.jid.split('@')[0]}* has challenged *@${
                                user.split('@')[0]
                            }* for a Tic-Tac-Toe match. Use *${
                                this.client.config.prefix
                            }tictactoe accept* to start the game`,
                            'text',
                            undefined,
                            undefined,
                            [M.sender.jid, user]
                        ))
                    }

                case 'a':
                case 'accept':
                    const challenge = this.challenges.get(M.from)
                    if (challenge?.challengee !== M.sender.jid)
                        return void (await M.reply('No one challenged you to a match'))
                    this.ongoing.set(M.from, {
                        players: [challenge?.challengee, challenge?.challenger]
                    })
                    this.game.set(M.from, {
                        lastMarked: challenge?.challengee,
                        board,
                        taken
                    })

                    return void (await M.reply(
                        await this.client.util.fetchBuffer('https://i.ibb.co/1qsdHcL/tic-tac-toe.png'),
                        'image',
                        undefined,
                        `Game Started!\n❌ - *@${challenge.challenger.split('@')[0]}*\n⭕ - *@${
                            challenge.challengee.split('@')[0]
                        }*`,
                        [challenge.challengee, challenge.challenger]
                    ))

                case 'reject':
                case 'r':
                    const ch = this.challenges.get(M.from)
                    if (ch?.challengee !== M.sender.jid && ch?.challenger !== M.sender.jid)
                        return void (await M.reply(
                            'No one challenged you to a match nor you challenged someone for a game'
                        ))
                    this.challenges.delete(M.from)
                    return void (await M.reply(
                        ch.challenger === M.sender.jid
                            ? `You rejected your challenge`
                            : `You Rejected *@${ch.challenger.split('@')[0]}*'s Challenge`,
                        'text',
                        undefined,
                        undefined,
                        ch.challenger === M.sender.jid ? undefined : [ch.challenger]
                    ))

                case 'mark':
                    if (!this.ongoing.has(M.from)) return void (await M.reply('No matches are ongoing at the moment'))
                    let ttt = this.game.get(M.from)
                    const Ttt = this.ongoing.get(M.from)
                    if (!Ttt?.players.includes(M.sender.jid))
                        return void (await M.reply("You aren't even in the game, Baka!"))
                    if (
                        !Ttt?.players.includes(this.client.util.sanitizeJid(this.client.user?.id ?? '')) &&
                        ttt?.lastMarked === M.sender.jid
                    )
                        return void (await M.reply('Not your turn'))
                    if (!term[1] || term[1] === undefined || term[1] === '')
                        return void (await M.reply('Provide the mark, Baka!'))
                    if (!options.includes(term[1]))
                        return void (await M.reply(
                            `Invalid option for marking. Available options for marking - *${options.join(', ')}*`
                        ))
                    if (ttt?.taken.includes(term[1]))
                        return void (await M.reply('This place has already been marked, Baka!'))
                    const modified = parseInt(
                        term[1]
                            .replace('a1', '0')
                            .replace('a2', '1')
                            .replace('a3', '2')
                            .replace('b1', '3')
                            .replace('b2', '4')
                            .replace('b3', '5')
                            .replace('c1', '6')
                            .replace('c2', '7')
                            .replace('c3', '8')
                    )
                    let mark = 'X'
                    if (
                        !Ttt?.players.includes(this.client.util.sanitizeJid(this.client.user?.id ?? '')) &&
                        Ttt.players[1] !== M.sender.jid
                    )
                        mark = 'O'
                    board = ttt?.board
                    board[modified] = mark
                    taken = ttt?.taken
                    taken.push(term[1])
                    if (Ttt?.players.includes(this.client.util.sanitizeJid(this.client.user?.id ?? ''))) {
                        const botMove = this.checkAndGetPosition(board)
                        const botModified = parseInt(
                            botMove
                                .replace('a1', '0')
                                .replace('a2', '1')
                                .replace('a3', '2')
                                .replace('b1', '3')
                                .replace('b2', '4')
                                .replace('b3', '5')
                                .replace('c1', '6')
                                .replace('c2', '7')
                                .replace('c3', '8')
                        )
                        taken.push(botMove)
                        board[botModified] = 'O'
                    }
                    this.game.set(M.from, {
                        lastMarked: M.sender.jid,
                        board,
                        taken
                    })
                    ttt = this.game.get(M.from)
                    const verify = this.verifyWin(ttt?.board, Ttt.players[1], Ttt.players[0])
                    const image = await this.client.util.displayBoard(ttt?.board)
                    if (verify !== 'draw' && taken.length <= 9) {
                        const text = `*@${verify.split('@')[0]}* has won the match`
                        this.ongoing.delete(M.from)
                        this.challenges.delete(M.from)
                        this.game.delete(M.from)
                        return void (await M.reply(image, 'image', undefined, text, [verify]))
                    } else if (taken.length === 9) {
                        const text = `The match has been drawn`
                        this.ongoing.delete(M.from)
                        this.challenges.delete(M.from)
                        this.game.delete(M.from)
                        return void (await M.reply(image, 'image', undefined, text))
                    } else return void (await M.reply(image, 'image'))

                case 'ff':
                case 'forfeit':
                    if (!this.ongoing.has(M.from)) return void (await M.reply('No games are going on at the moment'))
                    const TTt = this.ongoing.get(M.from)
                    if (!TTt?.players.includes(M.sender.jid))
                        return void (await M.reply("You aren't even in the game, Baka!"))
                    const index = TTt.players.findIndex((x) => x === M.sender.jid) === 0 ? 1 : 0
                    this.game.delete(M.from)
                    this.challenges.delete(M.from)
                    this.ongoing.delete(M.from)
                    M.reply('You forfeited')
                    return void (await M.reply(
                        `*@${Ttt?.players[index].split('@')[0]}* has won the match`,
                        'text',
                        undefined,
                        undefined,
                        [TTt.players[index]]
                    ))
            }
        } catch (e) {
            console.error(e)
        }
    }

    verifyWin = (board, player1, player2) => {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        const hasWon = (board, symbol) => {
            let winner = false
            winningCombos.map((combo) => {
                if (board[combo[0]] === symbol && board[combo[1]] === symbol && board[combo[2]] === symbol) {
                    winner = true
                }
            })
            return winner
        }
        const player1Symbol = 'X'
        const player2Symbol = 'O'
        if (hasWon(board, player1Symbol)) return player1
        if (hasWon(board, player2Symbol)) return player2
        return 'draw'
    }

    checkAndGetPosition = (gameBoard) => {
        const options = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
        if (gameBoard[1] && !gameBoard[0] && gameBoard[1] == gameBoard[2]) return options[0]
        else if (gameBoard[0] && !gameBoard[1] && gameBoard[0] == gameBoard[2]) return options[1]
        else if (gameBoard[1] && !gameBoard[2] && gameBoard[0] == gameBoard[1]) return options[2]
        else if (gameBoard[3] && !gameBoard[5] && gameBoard[3] == gameBoard[4]) return options[5]
        else if (gameBoard[3] && !gameBoard[4] && gameBoard[3] == gameBoard[5]) return options[4]
        else if (gameBoard[4] && !gameBoard[3] && gameBoard[4] == gameBoard[5]) return options[3]
        else if (gameBoard[6] && !gameBoard[8] && gameBoard[6] == gameBoard[7]) return options[8]
        else if (gameBoard[8] && !gameBoard[7] && gameBoard[6] == gameBoard[8]) return options[7]
        else if (gameBoard[7] && !gameBoard[6] && gameBoard[7] == gameBoard[8]) return options[6]
        else if (gameBoard[0] && !gameBoard[3] && gameBoard[0] == gameBoard[6]) return options[3]
        else if (gameBoard[0] && !gameBoard[6] && gameBoard[0] == gameBoard[3]) return options[6]
        else if (gameBoard[3] && !gameBoard[0] && gameBoard[3] == gameBoard[6]) return options[0]
        else if (gameBoard[1] && !gameBoard[7] && gameBoard[1] == gameBoard[4]) return options[7]
        else if (gameBoard[4] && !gameBoard[1] && gameBoard[4] == gameBoard[7]) return options[1]
        else if (gameBoard[1] && !gameBoard[4] && gameBoard[1] == gameBoard[7]) return options[4]
        else if (gameBoard[2] && !gameBoard[8] && gameBoard[2] == gameBoard[5]) return options[8]
        else if (gameBoard[2] && !gameBoard[5] && gameBoard[2] == gameBoard[8]) return options[5]
        else if (gameBoard[8] && !gameBoard[2] && gameBoard[5] == gameBoard[8]) return options[2]
        else if (gameBoard[0] && !gameBoard[8] && gameBoard[0] == gameBoard[4]) return options[8]
        else if (gameBoard[0] && !gameBoard[4] && gameBoard[0] == gameBoard[8]) return options[4]
        else if (gameBoard[4] && !gameBoard[0] && gameBoard[4] == gameBoard[8]) return options[0]
        else if (gameBoard[4] && !gameBoard[6] && gameBoard[4] == gameBoard[2]) return options[6]
        else if (gameBoard[4] && !gameBoard[2] && gameBoard[4] == gameBoard[6]) return options[2]
        else if (gameBoard[2] && !gameBoard[4] && gameBoard[2] == gameBoard[6]) return options[4]
        else {
            const emptyIndices = gameBoard
                .map((value, index) => (value === '' ? index : undefined))
                .filter((index) => index !== undefined)

            // Shuffle the empty indices using the sort function with a random function
            return options[emptyIndices[Math.floor(Math.random() * emptyIndices.length)]]
        }
    }

    game = new Map()

    challenges = new Map()

    ongoing = new Map()
}
