/**
 * Sistema de menú - extraído de settings/Bot/Js/menu.js
 * Genera el menú interactivo del bot
 */

import { prefixo } from '../core/config.js';

/**
 *
 * @param {string} title
 * @returns {string}
 */
const sectionBanner = (title) => `╭
  ❍  ${title}  ❐
╰`;

/**
 * Sistema de menú
 */
export const menu = (timeFt, Bot, sender, groupName, groupMembers) =>
	`
 ❱ ➢ ${timeFt}, @${sender?.split('@')[0]}
╭══════════════════
│✦ ➮ sᴏʏ: ${Bot}
│✦ ➮ ᴘʀᴇғɪᴊᴏs ᴀᴄᴛᴜᴀʟᴇs: ${prefixo.join(' ')}
│✦ ➮ Grupo: ${groupName}
│✦ ➮ Nº Participantes: ${groupMembers?.lenght ?? 0}
╰━━━━━─「✪」─━━━━━

\`📂 ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs\`

${sectionBanner('𝐈𝐍𝐅𝐎')}
*➢ ping*
> ➥Velocidad del bot
*➢ perfil*
> ➥Mira tu perfil
*➢ ship*
> ➥porcentaje de que le guste alguien
*➢ botcompleto*
> ➥Como tener un bot completo
*➢ grupos*
> ➥Grupos oficiales 
*➢ canales*
> ➥Canales oficiales
*➢ serbot*
> ➥Como ser un bot
*➢ Personalizarbot*
> ➥Como editar este bot
*➢ miapi*
> ➥Mira tu API key
*➢ comprarapi*
> ➥Como adquirir una clave API

${sectionBanner('𝐀𝐃𝐌𝐈𝐍')}
*➢ welcome 1/0*
> ➥Activa/desactiva las bienvenidas 
*➢ antilink 1/0*
> ➥Activa/desactiva anti enlaces
*➢ modoadmin 1/0*
> ➥Activa/desactiva el uso de solo adm.
*➢ todos*
> ➥menciona a todos con @
*➢ anuncio*
> ➥otra forma de mencionar a todos
*➢ ban/kick*
> ➥Elima a un participante
*➢ notify*
> ➥notificación fantasma
*➢ grupo*
> ➥abrir/cerrar grupo
*➢ rankrep*
> ➥Ranking de reputación
*➢ rankcoins*
> ➥Ranking de coins
*➢ ranknivel*
> ➥Ranking de nivel

${sectionBanner('𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒')}
*➢ play*
> ➥Descarga músicas 
*➢ playvideo*
> ➥Descarga videos 
*➢ playdoc*
> ➥Descarga videos en documento
*➢ tiktok*
> ➥Descarga videos de tiktok
*➢ facebook*
> ➥Descarga videos de facebook 
*➢ instagram*
> ➥Descarga videos de Instagram
*➢ mediafire*
> ➥Descarga archivos de mediafire 
*➢ descargarapk*
> ➥Desacarga apk
*➢ pinterest*
> ➥Desacarga imagenes de pinterest

${sectionBanner('𝐅𝐈𝐆𝐔𝐒')}
*➢ sticker*
> ➥convierte imagen/vídeo a sticker
*➢ attp*
> ➥Convierte texto a sticker 
*➢ attp2*
> ➥Convierte texto a sticker 
*➢ attp3*
> ➥Convierte texto a sticker 
*➢ emojimix*
> ➥Mezcla emojis

${sectionBanner('𝐇𝐄𝐑𝐑𝐀𝐌𝐈𝐄𝐍𝐓𝐀𝐒')}
*➢ toimg*
> ➥convierte sticker a imagen 
*➢ tomp3*      
> ➥Convierte vídeo a audio
*➢ ytsearch*
> ➥Buscar videos en Youtube
*➢ calc*
> ➥Calculadora en WhatsApp 
*➢ wikipedia*
> ➥Busca información en Wikipedia
*➢ google*
> ➥Busca información en Google 
*➢ simi*
> ➥Habla hot con el bot
*➢ horoscopo*
> ➥pronostico diario horoscopo
*➢ ia*
> ➥preguntale a IA
*➢ chatgpt*
> ➥preguntale a chatpgt 

${sectionBanner('𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀')}
*➢ Nivel*
> ➥Mira tu nivel
*➢ cartera*
> ➥Revisa tu dinero 
*➢ reg*
> ➥Regiatrate en el sistema
*➢ listreg*
> ➥Lista de registrados 
*➢ ruleta* 
> ➥Juega a la ruleta 
*➢ levelup*
> ➥Sube de nivel 
*➢ minar*
> ➥Mina y gana
*➢ regalar*
> ➥Regala dinero
*➢ mireputacion*
> ➥Mira tu reputación
*➢ tragamenciales*
> ➥Juega a tragamenciales 
*➢ dayli*   
> ➥Recibe tu recompensa diaria
*➢ pescar*      
> ➥Pesca y gana
*➢ tienda*     
> ➥Compra y vende experiencia 
*➢ casar* 
> ➥Parejas aleatorias

${sectionBanner('𝐂𝐑𝐄𝐀𝐃𝐎𝐑')}
*➢ sercreador*
> ➥Como convertirte en dueño
*➢ antiprivado*            
> ➥No aseptar personas en tu privado
*➢ revelarvisu*
> ➥Revela imagen de vista única 
*➢ reiniciar*
> ➥Reinicia el bot
*➢ bangp*
> ➥Bloquea el uso del bot en un grupo
*➢ unbangp*
> ➥Desbloquea el uso del bot en un grupo 
*➢ botoff*
> ➥Apaga el bot
*➢ boton*
> ➥Prende el bot
`;

// export type Command = <TParams extends Record = {}>(socket: import('baileys').WASocket, config?: object) => {
//   execute(params: TParams): Promise<void>
// };

// export const menuCommand: Command = (sock) => ({
//   /**
//    * Ejecuta el comando
//    * @param {Object} options
//    * @param {string} options.from
//    * @param {import('baileys').WAMessage | undefined} [options.info]
//    * @param {string | URL} options.JpgBot
//    * @param {string} options.timeFt
//    * @param {string} options.Bot
//    * @param {string} options.sender
//    * @param {string} options.groupName
//    * @param {string[]} options.groupMembers
//    * @param {boolean} options.isGroup
//    * @param {boolean} options.isReg
//    * @param {string} options.respuesta
//    */
// 	 execute: async({
// 		Bot,
// 		timeFt,
// 		sender,
// 		groupName,
// 		groupMembers,
// 		isGroup,
// 		JpgBot,
// 		from,
// 		info,
// 	}) => {
// 		if (!isGroup) return;

// 		// Enviar imagen del menú completa
// 		await sock.sendMessage(
// 			from,
// 			{
// 				image: { url: JpgBot },
// 				caption: menu(timeFt, Bot, sender, groupName, groupMembers),
// 				mentions: [sender],
// 			},
// 			{ quoted: info },
// 		);
// 	}
// })
