import axios from 'axios'
import { format, promisify } from 'util'
import { exec } from 'child_process'
export default class Utils {
    exec = promisify(exec)

    format = format

    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    fetch = async (url) => (await axios.get(url)).data

    fetchBuffer = async (url) => (await axios.get(url, { responseType: 'arraybuffer' })).data

    isTruthy = (value) => value !== null && value !== undefined

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

    capitalize = (str) => str.charAt(0).toUpperCase().concat(str.slice(1))

    sanitizeJid = (jid) => {
        const [a, b] = jid.split('@')
        return a.split(':').shift()?.concat('@', b) ?? jid
    }

    sanitizeJids = (jid) => {
        // if jid has :, remove it and the part after it till there is an @
        // then join the two parts with
        // example: 123:1@w.net -> 123@w.net
        if (/:\d+@/gi.test(jid)) {
            const decoded = jidDecode(jid)
            if (decoded?.server && decoded.user) {
                return format('%s@%s', decoded.user, decoded.server)
            }
            return jid
        } else return jid
    }
}
