import BaseCommand from '../../libs/BaseCommand.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'profile',
            aliases: ['p'],
            category: 'core',
            description: {
                content: "View your/other's profile."
            },
            exp: 7
        })
    }

    exec = async (M) => {
        let bio = ''
        try {
            bio = (await this.client.fetchStatus(M.sender.jid))?.status || ''
        } catch (error) {
            bio = ''
        }
        const { rank, level, exp, status } = await this.client.DB.getUserInfo(M.sender.jid)
        const url =
            (await this.client.profilePictureUrl(M.sender.jid, 'image').catch(() => null)) ??
            'https://static.wikia.nocookie.net/v__/images/7/73/Fuseu404notfound.png/revision/latest?cb=20171104190424&path-prefix=vocaloidlyrics'
        return void (await M.replyRaw({
            caption: `
🍥 *Username: ${M.sender.username}*

🏅 *Rank: ${rank}*

📑 *Bio: ${bio}*

🌟 *Experience: ${exp}*

🏆 *Level: ${level}*

👑 *Admin: _${M.group?.admins.includes(M.sender.jid) ? 'Yes' : 'Not'}_ of ${M.group?.title}*

🟥 *Ban: ${status.isBan}*
    `,
            image: {
                url
            },
            contextInfo: {
                externalAdReply: {
                    title: `${M.sender.username}'s Profile`,
                    body: '',
                    thumbnail: await this.client.util.fetchBuffer(url),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: '',
                    ShowAdAttribution: true
                }
            },
            jpegThumbnail: (await this.client.util.fetchBuffer(url)).toString('base64')
        }))
    }
}
