/**
 * Comandos de información general
 */

module.exports = {
  /**
   * Comando bot/botcompleto - Info sobre el bot completo
   */
  botcompleto: (params) => {
    const { enviar } = params
    enviar(`💫 ¿𝙌𝙪𝙞𝙚𝙧𝙚𝙨 𝙪𝙣 𝙗𝙤𝙩 𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙤 𝙘𝙤𝙣 𝙨𝙪𝙥𝙚𝙧 𝙁𝙪𝙣𝙘𝙞𝙤𝙣𝙚𝙨? 🤖

*[💡]  ᴏɴʟɪɴᴇ 24/7*
*[💡]  sᴏᴘᴏʀᴛᴇ 100% ᴅɪsᴘᴏɴɪʙʟᴇ*
*[💡]  ᴏʀɢᴀɴɪᴄᴇ sᴜ ɢʀᴜᴘᴏ*
*[💡]  ᴀᴅᴍɪɴɪsᴛʀᴇ sᴜ ɢʀᴜᴘᴏ*
*[💡]  ᴘʀᴏᴛᴇᴊᴀ sᴜ ɢʀᴜᴘᴏ*
*[💡]  ᴠᴇᴜʟᴠᴀ sᴜ ɢʀᴜᴘᴏ ᴍᴀs ᴀᴄᴛɪᴠᴏ*

  𝙋𝙍𝙀𝘾𝙄𝙊𝙎 𝙋𝘼𝙍𝘼 𝙀𝙇 𝘼𝙇𝙌𝑼𝙄𝙇𝙀𝙍 𝘿𝙀𝙇 𝘽𝙊𝙏

*┠💵⃟ꦿ〢* ᴘʟᴀɴ ǫᴜɪɴᴄᴇɴᴀʟ (15 dias): USD$ 1,50
*┠💵⃟ꦿ〢* ᴘʟᴀɴ ᴍᴇɴsᴜᴀʟ (30 dias): USD$ 2,90 ⭐(ᴍᴀs ᴘᴏᴘᴜʟᴀʀ)
*┠💵⃟ꦿ〢* ᴘʟᴀɴ sᴇᴍᴇsᴛʀᴀʟ (180 dias): USD$ 13,90
*┠💵⃟ꦿ〢* ᴘʟᴀɴ ᴀɴᴜᴀʟ (360 dias): USD$ 28,90
*┠💵⃟ꦿ〢* ʙᴏᴛ ᴘᴇʀᴢᴏɴᴀʟɪᴇᴀᴅᴏ (30 dias): USD$ 5,90 ⭐(ᴘᴏᴘᴜʟᴀʀ)

╚═════❖•ೋ° 🌟 °ೋ•❖═════╝

*__________🔒 𝙋𝙍𝙊𝙏𝙀𝘾𝘾𝙄𝙊𝙉𝙀𝙎 🔒__________*
*[🔐] ANTI-LINK*
*[🔐] ANTI-FAKE*
*[🔐] ANTI-CONTACTO*
*[🔐] ANTI-LOCALIZACION*
*[🔐] ANTI-DOCUMENTO*
*[🔐] ANTI-VIDEO*
*[🔐] ANTI-IMAGEN*
*[🔐] ANTI-AUDIO*
*[🔐] ANTI-VIEWONCE*

*_________🔧 𝙍𝙀𝘾𝑼𝑹𝑺𝑶𝑺 🔧__________*
*[🛠️] ᴄʀᴇᴀʀ sᴛɪᴄᴋᴇʀs*
*[🛠️] ᴅᴇsᴄᴀʀɢᴀʀ ᴍᴜsɪᴄᴀs*
*[🛠️] ᴅᴇsᴄᴀʀɢᴀʀ ᴠɪᴅᴇᴏs*
*[🛠️] ᴀʙʀɪʀ ʏ ᴄᴇʀʀᴀʀ ɢʀᴜᴘᴏ ᴄᴏɴ ᴛɪᴇᴍᴘᴏ*
*[🛠️] ʙᴀɴ ʏ ᴋɪᴄᴋ*
*[🛠️] ᴊᴜᴇɢᴏs*
*[🛠️] ᴄᴏᴍᴀɴᴅᴏs +🔞*

*_________👑 𝘾𝙊𝙉𝙏𝑅𝑨𝑻𝑬 👑__________*
[🔥] *Puedes contratar el bot directamente desde nuestra pagina web oficial*👇
[💬] https://naufrabot.com/`)
  },

  /**
   * Comando personalizarbot - Cómo personalizar el bot
   */
  personalizarbot: async (params) => {
    const { sock, from, info } = params

    const texto = `🤖 *PERSONALIZAR NAUFRABOT BASE*

Este bot es *100% editable*, puedes modificarlo completamente a tu gusto.

📚 *Pasos para personalizar el bot*

1️⃣ Cambiar nombre del bot
Edita el nombre en el archivo principal del bot.

2️⃣ Cambiar prefijo
Puedes cambiar el prefijo de comandos fácilmente.

3️⃣ Cambiar mensajes
Todos los mensajes del bot son editables.

4️⃣ Cambiar logo o foto
Puedes poner tu propia imagen o marca.

5️⃣ Agregar o quitar comandos
El bot es modular, puedes modificar las *case*.

6️⃣ Configurar APIs
Algunos comandos necesitan API externa.

7️⃣ Personalizar menú
Puedes editar el menú principal.

🎥 *Tutoriales completos en YouTube*

He creado *más de 10 videos* explicando cómo personalizar el bot paso a paso 👇

📺 YouTube:
https://youtube.com/playlist?list=PLsjiVxv1dUKw1bKCmvj43AuUDYOm8ghPF&si=NB_u_fSGZx0HhggK

Ahí encontrarás guías para:

✔ Personalizar comandos
✔ Modificar funciones
✔ Configurar APIs
✔ Crear nuevos sistemas

🚀 *NAUFRABOT BASE es totalmente personalizable.*

¡Haz tu propia versión del bot!`

    await sock.sendMessage(from, { text: texto }, { quoted: info })
  },

  /**
   * Comando comprarapi - Info sobre API
   */
  comprarapi: async (params) => {
    const { sock, from, info } = params

    const texto = `🌐 *COMPRAR API PARA EL BOT*

Algunos comandos del bot necesitan *API externa* para funcionar correctamente.

Por ejemplo:

📥 Descargas
🎨 Generar stickers con texto
🧡 HTTP requests
📹 Descargas de Facebook
📸 Descargas de redes sociales
⚙️ Inteligencia artificial

Para usar estas funciones necesitas una *API Key*.

🚀 *API oficial de Naufrabot*

Puedes comprar tu API aquí:

🔗 https://api.naufrabot.com

📚 *Pasos para usar la API*

1️⃣ Crear una cuenta en la web  
2️⃣ Comprar tu API Key  
3️⃣ Copiar la API Key  
4️⃣ Pegarla en la configuración del bot  
5️⃣ Reiniciar el bot  

Después de eso los comandos funcionarán correctamente.

✨ *Ventajas de la API*

✔ Respuestas rápidas  
✔ Alta estabilidad  
✔ Muchas funciones disponibles  
✔ Soporte continuo  

🌐 Web oficial:
https://api.naufrabot.com

🚀 *Potencia tu bot con la API oficial de Naufrabot.*`

    await sock.sendMessage(from, { text: texto }, { quoted: info })
  },

  /**
   * Comando grupos - Grupo oficial
   */
  grupos: (params) => {
    const { enviar } = params
    enviar(`🧩 𝙂𝙍𝑼𝑷𝑶 𝑶𝑭𝑰𝑪𝑰𝑨𝑳 𝑷𝑨𝑹𝑨 𝑼𝑺𝑨𝑅 𝑼𝑵 𝑩𝑶𝑻 𝑨𝑪𝑻𝑰𝑽𝑶 24/7 👇

➫https://chat.whatsapp.com/Jd7WKQBsAhkCG4k1SPxK7r?mode=ac_t`)
  },

  /**
   * Comando serdueño/sercreador/owner/serowner
   */
  serdueño: (params) => {
    const { enviar } = params
    enviar(`*🧩 Mira el siguiente vídeo donde te enseño cómo convertirte en dueño del bot y usar los comandos de owner 👇*

➫https://youtu.be/LugjBfJEoiQ?si=Z-qaGhjNdC-p3fGS`)
  },

  /**
   * Comando canal/canales
   */
  canal: (params) => {
    const { enviar } = params
    enviar(`𝘾𝙖𝙣𝙖𝙡𝙚𝙨 𝙤𝙛𝙞𝙘𝙞𝙖𝙡𝙚𝙨 𝙥𝙖𝙧𝙖 𝙧𝙚𝙘𝙞𝙗𝙞𝙧:
🌐𝙉𝙤𝙫𝙚𝙙𝙖𝙙𝙚𝙨 
🌐𝙎𝙤𝙧𝙩𝙚𝙤𝙨
🌐𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙘𝙞𝙤𝙣 
🌐𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙘𝙞𝙤𝙣𝙚𝙨 𝙨𝙤𝙗𝙧𝙚 𝙚𝙡 𝙗𝙤𝙩

*➫ YouTube* 
https://youtube.com/@naufrazapp_bots?si=Ie89Ben9B1Mn-jOU

*➫ Sitio web*
https://naufrabot.com/

*➫ Instagram*
https://www.instagram.com/naufrabot_official?igsh=cXFwemd0b213dWl1

*➫ Tik tok*
https://www.tiktok.com/@naufra.zapp?_t=8lMjEw7d9SX&_r=1

*➫ WhatsApp*
https://whatsapp.com/channel/0029Vaz3WoQ6RGJPJQcMXQ14
`)
  },

  /**
   * Comando serbot
   */
  serbot: async (params) => {
    const { enviar } = params

    const moneybot = `𝗣𝗲𝗻𝘀𝗮𝘀𝘁𝗲 𝗾𝘂𝗲 𝘁𝗲 𝗴𝗲𝗻𝗲𝗿𝗮𝗿𝗶𝗮 𝗲𝗹 𝗖𝗼𝗱𝗶𝗴𝗼 𝗤𝗥, ¿𝗩𝗲𝗿𝗱𝗮𝗱? 😂

𝗟𝗮𝗺𝗲𝗻𝘁𝗮𝗯𝗹𝗲𝗺𝗲𝗻𝘁𝗲, *𝗲𝗻 𝗲𝘀𝘁𝗲 𝗯𝗼𝘁 𝗻𝗼 𝗽𝘂𝗲𝗱𝗲𝘀 𝘀𝗲𝗿 𝘀𝘂𝗯 𝗯𝗼𝘁* 𝗽𝗼𝗿𝗾𝘂𝗲 𝗲𝘀𝗼 𝗰𝗼𝗺𝗽𝗿𝗼𝗺𝗲𝘁𝗲 𝗹𝗼𝘀 𝗿𝗲𝗰𝘂𝗲𝗿𝘀𝗼𝘀 𝗱𝗲𝗹 𝘀𝗲𝗿𝘃𝗶𝗱𝗼𝗿 𝘆 𝗹𝗼 𝗵𝗮𝗰𝗲 𝗺𝗮𝘀 𝗹𝗲𝗻𝘁𝗼.  
𝗦𝗶 𝗿𝗲𝗮𝗹𝗺𝗲𝗻𝘁𝗲 𝗾𝘂𝗲𝗿𝗲𝘀 𝘀𝗲𝗿 𝘀𝘂𝗯 𝗯𝗼𝘁, 𝗽𝘂𝗲𝗱𝗲𝘀 𝗼𝗯𝘁𝗲𝗻𝗲𝗿 𝗺𝗮𝘀 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝗰𝗶𝗼𝗻 𝗲𝗻 𝗻𝘂𝗲𝘀𝘁𝗿𝗮 𝗽𝗮𝗴𝗶𝗻𝗮 𝘄𝗲𝗯:  
🔗 https://naufrabot.com/subbots/`;

    await enviar(moneybot);
  }
}