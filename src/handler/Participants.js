import DefineGroup from '../decorators/DefineGroup.js'
export default class Participant {
    constructor(client) {
        this.client = client
    }

    participantUpdate = async (event) => {
        const { participants, id, action } = event
        const { toggled } = await new DefineGroup(id, this.client).build()
        if (!toggled.events) return
        for (const participant of participants) {
            const caption = this.events[action]
            const text = caption[Math.floor(Math.random() * caption.length)]
            await this.client.sendMessage(id, {
                text: `_*${text.replace('{x}', `@${participant.split('@')[0]}`)}*_`,
                mentions: [participant]
            })
        }
    }

    events = {
        add: [
            '{x} has joined the party!',
            'A wild {x} appeared!',
            '{x} hopped into the group!',
            '{x} has arrived!',
            'Welcome to the group, {x}. Hope you brought pizza.',
            "{x} has arrived. Let's have a beer!",
            '{x} has arrived. May I suggest a nice cold one?',
            "Well, {x}, it's about time you arrived!",
            'Um, {x} has arrived. I wonder if they brought their own cup of tea?',
            'Very funny {x}, I expected you to be here a while.',
            'Good to see you, {x}.',
            "It's a pleasure to see you {x}."
        ],

        remove: [
            '{x} has left the party.',
            '{x} has left the group.',
            '{x} has left the group. I hope you enjoyed your stay.',
            "Well {x}, it's about time you left.",
            'Bye {x}.',
            "It's been nice meeting you {x}.",
            'Take care {x}.',
            'Later {x}.',
            'Catch you later {x}.',
            'Au Revoir {x}.',
            'Till next time {x}.',
            'We will meet again {x}.',
            "I'm looking forward to seeing you {x}.",
            'I hope you brought a souvenir {x}.'
        ],

        demote: [
            "{x}, you're fired!",
            "Adminship isn't for you {x}.",
            "{x} you had a good run, but you're no longer an admin.",
            "Well, I don't know how to tell you this, but {x} has been demoted.",
            '{x} has been demoted. I hope you enjoyed your admin run.'
        ],

        promote: [
            "{x}, you're an admin!",
            "Welcome {x}, you're an admin!",
            "{x} you're an admin! I hope you take care of us",
            "Well, you're an admin now {x}.",
            "Looks like you're an admin now {x}."
        ]
    }
}
