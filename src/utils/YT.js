import { createWriteStream, promises } from 'fs'
import { tmpdir } from 'os'
import ytdl from 'ytdl-core'
const { validateURL } = ytdl
const { readFile } = promises

export default class YT {
    id

    constructor(url, type) {
        this.id = this.parseId()
        this.url = url
        this.type = type
    }

    validateURL = () => validateURL(this.url)

    getInfo = async () => await ytdl.getInfo(this.url)

    getBuffer = async (
        filename = `${tmpdir()}/${Math.random().toString(36)}.${this.type === 'audio' ? 'mp3' : 'mp4'}`
    ) => {
        const stream = createWriteStream(filename)
        ytdl(this.url, {
            filter: this.type === 'audio' ? 'audioonly' : 'videoandaudio',
            quality: this.type === 'audio' ? 'highestaudio' : 'highest'
        }).pipe(stream)
        filename = await new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(filename))
            stream.on('error', (err) => reject(err && console.log(err)))
        })
        return await readFile(filename)
    }

    get thumbnail() {
        return `https://i.ytimg.com/vi/${this.id}/hqdefault.jpg`
    }

    getThumbnail = async () => await this.getBuffer(this.thumbnail)

    parseId = () => {
        const split = this.url.split('/')
        if (this.url.includes('youtu.be')) return split[split.length - 1]
        return this.url.split('=')[1]
    }
}
