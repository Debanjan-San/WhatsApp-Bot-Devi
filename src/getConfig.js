import 'dotenv/config'
const getConfig = () => {
    return {
        name: process.env.NAME || 'Devi',
        session: process.env.SESSION || 'session',
        prefix: process.env.PREFIX || '#',
        port: process.env.PORT || 3000,
        mongo:
            process.env.MONGO || 'mongodb+srv://cara:das1234@cluster0.d2czz.mongodb.net/?retryWrites=true&w=majority',
        mods: process.env.MODS
            ? process.env.MODS.split(',').map((id) => {
                  if (id.endsWith('@s.whatsapp.net')) return id
                  return id.replace('+', '').concat('@s.whatsapp.net')
              })
            : []
    }
}

export default getConfig
