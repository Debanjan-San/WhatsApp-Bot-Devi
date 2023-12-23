import Utils from './Util.js'

export const reactions = [
    'bully',
    'cuddle',
    'cry',
    'hug',
    'kiss',
    'lick',
    'pat',
    'smug',
    'yeet',
    'blush',
    'bonk',
    'smile',
    'wave',
    'highfive',
    'bite',
    'handhold',
    'nom',
    'glomp',
    'kill',
    'kick',
    'slap',
    'happy',
    'wink',
    'poke',
    'dance',
    'cringe',
    'tickle',
    'baka',
    'bored',
    'laugh',
    'punch',
    'pout',
    'stare',
    'thumbsup'
]

export class Reaction {
    getReaction = async (reaction, single = true) => {
        const data = await this.utils.fetch(`https://g.tenor.com/v1/search?q=${reaction}&key=LIVDSRZULELA&limit=8`)
        const words = this.getSuitableWords(reaction, single)
        return {
            url: data.results?.[Math.floor(Math.random() * data.results.length)]?.media[0]?.mp4?.url,
            words
        }
    }

    getSuitableWords = (reaction, single = true) => {
        switch (reaction) {
            case 'bite':
                return 'Bit'
            case 'blush':
                return 'Blushed at'
            case 'bonk':
                return 'Bonked'
            case 'bully':
                return 'Bullied'
            case 'cringe':
                return 'Cringed at'
            case 'cry':
                return single ? 'Cried by' : 'Cried in front of'
            case 'cuddle':
                return 'Cuddled'
            case 'dance':
                return 'Danced with'
            case 'glomp':
                return 'Glomped at'
            case 'handhold':
                return 'Held the hands of'
            case 'happy':
                return single ? 'is Happied by' : 'is Happied with'
            case 'highfive':
                return 'High-fived'
            case 'hug':
                return 'Hugged'
            case 'kick':
                return 'Kicked'
            case 'kill':
                return 'Killed'
            case 'kiss':
                return 'Kissed'
            case 'lick':
                return 'Licked'
            case 'nom':
                return 'Nomed'
            case 'pat':
                return 'Patted'
            case 'poke':
                return 'Poked'
            case 'slap':
                return 'Slapped'
            case 'smile':
                return 'Smiled at'
            case 'smug':
                return 'Smugged'
            case 'tickle':
                return 'Tickled'
            case 'wave':
                return 'Waved at'
            case 'wink':
                return 'Winked at'
            case 'yeet':
                return 'Yeeted at'
            case 'baka':
                return 'Yelled BAKA at'
            case 'bored':
                return 'is Bored of'
            case 'laugh':
                return 'Laughed at'
            case 'punch':
                return 'Punched'
            case 'pout':
                return 'Pouted'
            case 'stare':
                return 'Stared at'
            case 'thumbsup':
                return 'Thumbs-upped at'
        }
    }

    utils = new Utils()
}
