import git from 'simple-git'
import Utils from './Util.js'
export default class Update {
    constructor(logger) {
        this.logger = logger
    }

    gitPull = async () => {
        this.logger.info('Checking for updates')
        await git.fetch()
        const newCommits = await git.log(['main..origin/main'])
        if (newCommits.total) {
            this.logger.info('New Update pending, updating')
            await git.pull('origin', 'main', (err) => {
                if (update && update.summary.changes) {
                    if (update.files.includes('package.json'))
                        this.utils.exec('npm install').stderr.pipe(process.stderr)
                    this.logger.info('Updated the bot with latest changes')
                } else if (err) {
                    this.logger.warn('Could not pull latest changes!')
                    this.logger.error(err)
                }
            })
        } else this.logger.info('Bot is already working on latest version')
    }

    utils = new Utils()
}
