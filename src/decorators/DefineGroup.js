export default class DefineGroup {
    title = ''

    participants = new Array()

    admins = new Array()

    constructor(gid, client) {
        this.client = client
        this.gid = gid
    }

    build = async () => {
        this.metadata = await this.client.groupMetadata(this.gid)
        this.title = this.metadata.subject
        for (const { id, admin } of this.metadata.participants) {
            if (['admin', 'superadmin'].includes(admin ?? 'n')) this.admins.push(id)
            this.participants.push(id)
        }
        return this
    }
}
