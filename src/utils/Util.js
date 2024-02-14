import { readFile, unlink, writeFile, readdirSync, statSync } from 'fs'
import { format, promisify } from 'util'
import { exec } from 'child_process'
import { tmpdir } from 'os'
import { Canvacord } from 'canvacord'
import { join } from 'path'
import DefineMesssage from '../decorators/DefineMesssage.js'
import { jidDecode, downloadContentFromMessage } from '@iamrony777/baileys'
import axios from 'axios'
export default class Utils {
    exec = promisify(exec)

    format = format

    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    fetch = async (url) => (await axios.get(url)).data

    fetchBuffer = async (url) => (await axios.get(url, { responseType: 'arraybuffer' })).data

    isTruthy = (value) => value !== null && value !== undefined

    readdirRecursive = (directory) => {
        const results = []

        const read = (path) => {
            const files = readdirSync(path)

            for (const file of files) {
                const dir = join(path, file)
                if (statSync(dir).isDirectory()) read(dir)
                else results.push(dir)
            }
        }
        read(directory)
        return results
    }

    bufferToBase64 = (buffer) =>
        new Promise((resolve) => {
            const buff = new Buffer(buffer)
            const base64string = buff.toString('base64') // https://nodejs.org/api/buffer.html#buftostringencoding-start-end
            return setTimeout(() => {
                resolve(base64string)
            }, 1000)
        })

    displayBoard = async (Board) => {
        const board = Board
        const data = {
            a1: board[0],
            b1: board[1],
            c1: board[2],
            a2: board[3],
            b2: board[4],
            c2: board[5],
            a3: board[6],
            b3: board[7],
            c3: board[8]
        }
        return await Canvacord.tictactoe(data, {
            bg: 'black',
            bar: 'blue',
            x: 'red',
            o: 'white'
        })
    }

    extractNumbers = (content) => {
        const search = content.match(/(-\d+|\d+)/g)
        if (search !== null) {
            const result = search.map((string) => parseInt(string))
            for (let i = 0; i < result.length; i++) {
                if (result[i] > 0) continue
                result[i] = 0
            }
            return result
        }
        return []
    }

    getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    getRandomFloat = (min, max) => {
        return Math.random() * (max - min) + min
    }

    getRandomItem = (array) => array[this.getRandomInt(0, array.length - 1)]

    getRandomItems = (array, count) => {
        return new Array(count).fill(0).map(() => this.getRandomItem(array))
    }

    getUrls = (url) => {
        const urls = new Set()
        const regex = /(https?:\/\/[^\s]+)/g
        let match
        while ((match = regex.exec(url)) !== null) {
            urls.add(match[1])
        }
        return urls
    }

    gifToMp4 = async (gif) => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.gif`, gif)
        await this.exec(
            `ffmpeg -f gif -i ${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${filename}.mp4`
        )
        const buffer = await readFile(`${filename}.mp4`)
        Promise.all([unlink(`${filename}.gif`), unlink(`${filename}.mp4`)])
        return buffer
    }

    downloadMediaMessage = async (M) => {
        let msg
        let type
        if (M instanceof DefineMesssage) {
            const { message } = M.raw
            if (!message) throw new Error('Message is not a media message')
            type = M.type
            msg = message[type]
        } else {
            type = Object.keys(M)[0]
            msg = M[type]
        }
        const stream = await downloadContentFromMessage(msg, type.replace('Message', ''))
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }

    capitalize = (str) => str.charAt(0).toUpperCase().concat(str.slice(1))

    sanitizeJid = (jid) => {
        const [a, b] = jid.split('@')
        return a.split(':').shift()?.concat('@', b) ?? jid
    }

    sanitizeJids = (jid) => {
        if (/:\d+@/gi.test(jid)) {
            const decoded = jidDecode(jid)
            if (decoded?.server && decoded.user) {
                return format('%s@%s', decoded.user, decoded.server)
            }
            return jid
        } else return jid
    }
}
