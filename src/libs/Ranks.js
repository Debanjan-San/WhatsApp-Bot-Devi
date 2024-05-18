export const ranks = {
    Recruit: {
        exp: 0,
        emoji: '🔨'
    },
    Apprentice: {
        exp: 1000,
        emoji: '🛠️'
    },
    Disciple: {
        exp: 5000,
        emoji: '⚒️'
    },
    Adept: {
        exp: 10000,
        emoji: '🍀'
    },
    Master: {
        exp: 20000,
        emoji: '〽️'
    },
    Grandmaster: {
        exp: 50000,
        emoji: '🔮'
    },
    Legendary: {
        exp: 100000,
        emoji: '👑'
    },
    'Legendary II': {
        exp: 135000,
        emoji: '👑'
    },
    'Legendary III': {
        exp: 175000,
        emoji: '👑'
    },
    Mythical: {
        exp: 200000,
        emoji: '🌟'
    },
    'Mythical II': {
        exp: 350000,
        emoji: '🌟'
    },
    'Mythical III': {
        exp: 425000,
        emoji: '🌟'
    },
    Immortal: {
        exp: 500000,
        emoji: '💀'
    },
    'Immortal II': {
        exp: 650000,
        emoji: '💀'
    },
    'Immortal III': {
        exp: 850000,
        emoji: '💀'
    },
    Radiant: {
        exp: 1000000,
        emoji: '💫'
    },
    Divine: {
        exp: 2000000,
        emoji: '🔥'
    }
}

export const getRank = (exp) => {
    const lranks = Object.entries(ranks)
    const [name, rank] = lranks.reduce(
        ([currentName, currentRank], [key, value]) => {
            if (exp >= value.exp) {
                return [key, value]
            }
            return [currentName, currentRank]
        },
        ['Recruit', ranks['Recruit']]
    )
    return { name, data: rank }
}
