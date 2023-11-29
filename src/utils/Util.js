import { readdirSync, statSync } from 'fs'
import { format, promisify } from 'util'
import { exec } from 'child_process'
import { join } from 'path'
import { jidDecode } from '@iamrony777/baileys'
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

    getRandomItem = (array) => array[getRandomInt(0, array.length - 1)]

    getRandomItems = (array, count) => {
        return new Array(count).fill(0).map(() => getRandomItem(array))
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
