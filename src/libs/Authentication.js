import WASocket from '@whiskeysockets/baileys'
export default class AuthenticationFromDatabase {
    constructor(sessionId, DB) {
        this.sessionId = sessionId
        this.DB = DB
    }

    useDatabaseAuth = async () => {
        let creds
        let keys = {}
        const storedCreds = await this.DB.session.get(this.sessionId)
        if (storedCreds && storedCreds.session) {
            const parsedCreds = JSON.parse(storedCreds.session, WASocket.BufferJSON.reviver)
            creds = parsedCreds.creds
            keys = parsedCreds.keys
        } else creds = WASocket.initAuthCreds()

        const saveState = async () => {
            const session = JSON.stringify({ creds, keys }, WASocket.BufferJSON.replacer, 2)
            await this.DB.session.set(this.sessionId, { session })
        }

        const clearState = async () => {
            await this.DB.session.delete(this.sessionId)
        }

        return {
            state: {
                creds,
                keys: {
                    get: (type, ids) => {
                        const key = this.KEY_MAP[type]
                        return ids.reduce((dict, id) => {
                            let value = keys[key]?.[id]
                            if (value) {
                                if (type === 'app-state-sync-key')
                                    value = WASocket.proto.Message.AppStateSyncKeyData.fromObject(value)
                                dict[id] = value
                            }
                            return dict
                        }, {})
                    },
                    set: (data) => {
                        for (const _key in data) {
                            const key = this.KEY_MAP[_key]
                            keys[key] = keys[key] || {}
                            Object.assign(keys[key], data[_key])
                        }
                        saveState()
                    }
                }
            },
            saveState,
            clearState
        }
    }

    KEY_MAP = {
        'pre-key': 'preKeys',
        session: 'sessions',
        'sender-key': 'senderKeys',
        'app-state-sync-key': 'appStateSyncKeys',
        'app-state-sync-version': 'appStateVersions',
        'sender-key-memory': 'senderKeyMemory'
    }
}
