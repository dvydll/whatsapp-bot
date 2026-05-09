/**
 * Comandos de información del bot
 */

import { fetchJson } from '../http/download.js'

export default {
  /**
   * Comando miapi/apikey - Consulta info de API
   */
  miapi: async (params) => {
    const { APINAUFRA, NAUFRA_KEY, enviar } = params

    try {
      const apiURL = `${APINAUFRA}/api/keyinfo?apikey=${NAUFRA_KEY}`
      const data = await fetchJson(apiURL)

      if (!data.status) {
        return enviar("❌ Error consultando API")
      }

      enviar(`🔑 *INFORMACIÓN DE API*

👤 Usuario: ${data.usuario}

📊 Requests usadas: ${data.usadas}
📦 Límite total: ${data.limite}

⚡ Restantes: ${data.restantes}

🌐 API: api.naufrabot.com`)

    } catch (e) {
      console.log(e)
      enviar("❌ Error consultando API")
    }
  },

  /**
   * Comando infobot/ping - Info del bot
   */
  infobot: (params) => {
    const { time, data, Bot, deviceType, runtime, pushname, JpgBot, sock, from, info } = params
    const uptime = params.uptime || process.uptime()

    const botinfo = `
╔═【 𝑰𝒏𝒇𝒐 𝒅𝒆𝒍 𝑩𝒐𝒕 】═╗
⏰  𝐇𝐎𝐑𝐀  »  ${time}
📅  𝐅𝐄𝐂𝐇𝐀 »  ${data}
🤖  𝐍𝐎𝐌𝐁𝐑𝐄 »  ${Bot}
🔰  𝐏𝐑𝐄𝐅𝐈𝐉𝐎 »  𝓜𝓾𝓵𝓽𝓲𝓹𝓻𝓮𝓯𝓲𝓳𝓸
⚡  𝐕𝐄𝐋𝐎𝐂𝐈𝐃𝐀𝐃 »  ${params.latensi?.toFixed(4) || '0'} seg
📲  𝐃𝐈𝐒𝐏𝐎𝐒𝐈𝐓𝐈𝐕𝐎 »  ${deviceType}
⏳  𝐄𝐍 𝐋𝐈𝐍𝐄𝐀 »  ${runtime(uptime)}
💾  𝐌𝐄𝐌𝐎𝐑𝐈𝐀 »  ${(params.memoryUsage || 0).toFixed(2)}MB
👤  𝐔𝐒𝐔𝐀𝐑𝐈𝐎 »  ${pushname}
╚══❖═══════❖══╝
`
    sock.sendMessage(from, { image: { url: JpgBot }, caption: botinfo }, { quoted: info })
  },

  /**
   * Comando reiniciar - Reinicia el bot
   */
  reiniciar: (params) => {
    const { enviar, sender, owner } = params

    console.log("=== DEBUG REINICIAR ===")
    console.log("Número que ejecuta el comando:", sender)
    console.log("Número(s) configurados como owner:", owner || "No definido")
    console.log("¿Es owner?:", owner?.includes(sender))

    enviar('𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙰𝙽𝙳𝙾, 𝙰𝙶𝚄𝙰𝚁𝙳𝙴 𝚄𝙽 𝙼𝙾𝙼𝙴𝙽𝚃𝙾 ')
    setTimeout(async () => {
      console.log("Reiniciando el bot...")
      process.exit(0)
    }, 1000)
  }
}