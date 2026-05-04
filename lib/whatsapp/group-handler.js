/**
 * Handler de eventos de grupo - extraído de index.js
 * Maneja bienvenidas, despedidas y cambios de admins
 */

import chalk from 'chalk'

const { color } = chalk

/**
 * Crea el handler de grupos
 * @param {Object} sock - Socket de Baileys
 * @param {Object} config - Config del grupo (welkom, etc.)
 * @returns {Function} Handler para group-participants.update
 */
const createGroupHandler = (sock, config = {}) => {
  const { welkom = [] } = config

  return async (anu) => {
    // Debug: ver todos los eventos de grupo
    console.log('\n🔔 GRUPO EVENTO:', anu.action, '- ID:', anu.id, '- Participants:', anu.participants)

    try {
      const metadata = await sock.groupMetadata(anu.id)
      const participants = anu.participants

      for (const participant of participants) {
        console.log('🔔 Procesando action:', anu.action)

        // Bienvenida - usuario se une al grupo
        if (anu.action === 'add') {
          // Solo procesar si las bienvenidas están activas
          if (!welkom.includes(anu.id)) {
            console.log('🔔 Bienvenidas no activas para este grupo')
            continue
          }

          const welcomeImg = "https://i.ibb.co/HDf3hw9J/20250702-214923.jpg"
          const grup = metadata.subject
          const mem = metadata.participants.length

          const sol = `💌 「 Bienvenid@ a *${grup}* @${participant?.split('@')[0]} 
『 👥 Miembros actuales: ${mem} 』`

          await sock.sendMessage(anu.id, {
            image: { url: welcomeImg },
            caption: sol,
            mentions: [participant]
          })
        }

        // Promote - usuario se vuelve administrador (siempre funciona)
        if (anu.action === 'promote') {
          console.log('🔔 Detectado PROMOTE, enviando mensaje...')
          const promoteImg = "https://i.postimg.cc/0ygy14nq/20251017-152852.jpg"

          const teks = `
✦━─┈༓༒༓───┈━✦

     *✧༺ 𝓝𝓾𝓮𝓿𝓸 𝓐𝓭𝓶𝓲𝓷 ༻✧*

🪪 𝗡𝗼𝗺𝗯𝗿𝗲: @${participant?.split('@')[0]}
🌐 𝗚𝗿𝘂𝗽𝗼: ${metadata.subject}
💌 「 ¡Enhorabuena! 🎉 Has ascendido a la mesa de los administradores 🪄 」

✦━─┈༓༒༓─┈━✦
`
          await sock.sendMessage(anu.id, {
            image: { url: promoteImg },
            caption: teks
          })
        }
      }
    } catch (e) {
      console.log('Error: %s', color(e, "red"))
    }
  }
}

export {
  createGroupHandler
}