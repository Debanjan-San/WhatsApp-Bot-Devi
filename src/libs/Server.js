import express from 'express'
import { join } from 'path'
import { URL } from 'url'
export default class Server {
    app = express()

    __dirname = new URL('.', import.meta.url).pathname

    router = express.Router()

    constructor(config, log) {
        this.qr
        this.log = log
        this.config = config
        this.connection
        this.app.use('/', express.static(join(this.__dirname, '..', '..', 'public')))
        this.app.get('/wa/qr', (req, res) => {
            const { session } = req.query
            if (!session)
                return void res
                    .status(404)
                    .setHeader('Content-Type', 'text/plain')
                    .send('Provide the session for authentication')
                    .end()
            if (this.config.session !== session)
                return void res.status(404).setHeader('Content-Type', 'text/plain').send('Invalid session').end()
            if (this.connection === 'open')
                return void res
                    .status(404)
                    .setHeader('Content-Type', 'text/plain')
                    .send('You are already authenticated')
                    .end()
            if (!this.qr)
                return void res.status(404).setHeader('Content-Type', 'text/plain').send('QR not generated').end()
            res.status(200).setHeader('Content-Type', 'image/png').send(this.qr)
        })

        this.app.all('*', (req, res) => res.sendStatus(404))

        this.app.listen(this.config.port, () => this.log.notice(`Server started on PORT : ${this.config.port}`))
    }
}
