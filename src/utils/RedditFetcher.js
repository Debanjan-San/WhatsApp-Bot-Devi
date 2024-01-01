import Utils from './Util.js'
export default class RedditFetcher {
    constructor(reddit) {
        this.reddit = reddit
    }

    fetch = async () => {
        return await this.utils
            .fetch(`https://meme-api.com/gimme/${this.reddit}`)
            .then((res) => {
                if (!res.url) return { error: 'An error occurred' }
                return res
            })
            .catch(() => {
                return { error: 'An error occurred' }
            })
    }

    utils = new Utils()
}
