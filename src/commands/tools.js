/**
 * Comandos de Herramientas (descargas, conversión, IA)
 */

import { fetchJson } from '../http/download.js';
import { getFileBuffer } from '../whatsapp/utils/download-utils.js';
import { sendImageAsSticker2, sendVideoAsSticker2 } from '../whatsapp/sticker/sticker2.js';
import economy from '../systems/economy.js';

export const toolCommands = {
	// === STICKER ===
	sticker: {
		aliases: ['s', 'sticker'],
		handler: async ({ from, info, isReg, enviar, respuesta, sock, coins, economy, pushname, groupName, getFileBuffer: gfb }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (coins < 1) return enviar(respuesta.coins);

			const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
			const boij2 = RSM?.imageMessage || info.message?.imageMessage ||
				RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage ||
				info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage;

			const boij = RSM?.videoMessage || info.message?.videoMessage ||
				RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage ||
				info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage;

			if (boij2) {
				enviar(`Creando su sticker espere un poco ❤️`);
				const pack = `👑 Dueño 👑\n ✅Daya\n⭐𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 :\n ${pushname}`;
				const author2 = `🤖 𝐁𝐨𝐭 🤖\n ⃟DayaBot\n💐 𝐆𝐫𝐮𝐩𝐨💐\n${groupName}`;
				const owgi = await getFileBuffer(boij2, 'image');
				await sendImageAsSticker2(sock, from, owgi, info, { packname: pack, author: author2 });
				await economy.addXp(sender, 1);
				await economy.delkoin(sender, 1);
			} else if (boij && boij.seconds < 11) {
				enviar(`Creando tu Sticker ${pushname}`);
				const pack = `👑 Dueño 👑\n ✅Daya\n⭐𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 :\n ${pushname}`;
				const author2 = `🤖 𝐁𝐨𝐭 🤖\n ⃟DayaBot\n💐 𝐆𝐫𝐮𝐩𝐨💐\n${groupName}`;
				const owgi = await getFileBuffer(boij, 'video');
				await sendVideoAsSticker2(sock, from, owgi, info, { packname: pack, author: author2 });
				await economy.addXp(sender, 1);
				await economy.delkoin(sender, 1);
			} else {
				return enviar('Marque una imagen o un vídeo máximo de 10 segundos ⏲️');
			}
		},
	},

	// === ATTP (sticker de texto) ===
	attp: {
		aliases: ['attp', 'attp2', 'attp3'],
		handler: async ({ args, q, from, isReg, enviar, respuesta, sock, info, APINAUFRA, NAUFRA_KEY }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (!q) return enviar('Coloca un texto o emoji después del comando');

			try {
				const url = `${APINAUFRA}/api/${args[0]}?text=${encodeURIComponent(q)}&apikey=${NAUFRA_KEY}`;
				const res = await fetch(url);
				const buffer = await res.buffer();
				await sock.sendMessage(from, { sticker: buffer }, { quoted: info });
			} catch (e) {
				console.log(e);
				enviar('Error al crear sticker');
			}
		},
	},

	// === A MP3 ===
	amp3: {
		aliases: ['amp3', 'tomp3'],
		handler: async ({ from, info, isReg, isQuotedVideo, enviar, respuesta, sock }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (!isQuotedVideo) return enviar(`[❗] Marque un video`);
			enviar('`Creando....`');
			const tomp = await getFileBuffer(
				info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage,
				'video',
			);
			sock.sendMessage(from, { audio: tomp, mimetype: 'audio/mpeg' }, { quoted: info });
			await economy.addXp(sender, 6);
			await economy.delkoin(sender, 3);
		},
	},

	// === TOIMG ===
	toimg: {
		aliases: ['toimg'],
		handler: async ({ from, info, isReg, isQuotedSticker, enviar, sock, pushname }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (!isQuotedSticker) return enviar('[❗]• MARQUE UN STICKER •');
			try {
				enviar('`Creando....`');
				const buff = await getFileBuffer(
					info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage,
					'sticker',
				);
				sock.sendMessage(from, { image: buff, caption: `[❗] *${pushname}*, Aquí tienes tu pedido` }, { quoted: info })
					.catch(() => enviar('Nose pudo convertir a imagen verifica que sea un sticker y no un gif ❌'));
				await economy.addXp(sender, 3);
				await economy.delkoin(sender, 2);
			} catch {
				enviar('Ocurrio un error');
			}
		},
	},

	// === GPT / IA ===
	gpt: {
		aliases: ['gpt', 'gpt4', 'openai', 'chatgpt', 'ia'],
		handler: async ({ q, from, enviar, sock, info, APINAUFRA, NAUFRA_KEY }) => {
			if (!q) return enviar('❌ Escribe una pregunta');
			try {
				const apiURL = `${APINAUFRA}/chatgpt?apikey=${NAUFRA_KEY}&prompt=${encodeURIComponent(q)}&t=${Date.now()}`;
				const data = await fetchJson(apiURL);
				const mensaje = `🤖 *ChatGPT*\n\n${data.respuesta}`;
				await sock.sendMessage(from, { text: mensaje }, { quoted: info });
			} catch (e) {
				console.log('ERROR IA:', e);
				enviar('❌ Error usando la IA');
			}
		},
	},

	// === YOUTUBE SEARCH ===
	ytsearch: {
		aliases: ['ytsearch'],
		handler: async ({ q, from, enviar, sock, info, APINAUFRA, NAUFRA_KEY }) => {
			if (!q) return enviar('❌ Escribe un nombre para buscar en YouTube');
			try {
				const apiURL = `${APINAUFRA}/ytsearch?apikey=${NAUFRA_KEY}&q=${encodeURIComponent(q.trim())}`;
				const apiData = await fetchJson(apiURL);

				if (!apiData?.status || !apiData.resultados?.length) {
					return enviar('❌ No se encontraron resultados');
				}

				const firstVideo = apiData.resultados[0];
				let text = `「✦」Resultados para *${q.trim()}*\n\n`;

				for (const video of apiData.resultados) {
					text += `❀ *${video.title}*\n`;
					text += `> ✐ Canal » *${video.author}*\n`;
					text += `> ⴵ Duración » *${video.duration}*\n`;
					text += `> 👁 Visitas » *${video.views.toLocaleString()}*\n`;
					text += `> 🜸 Link » _${video.url}_\n\n`;
				}

				await sock.sendMessage(from, { image: { url: firstVideo.thumbnail }, caption: text.trim() }, { quoted: info });
			} catch (e) {
				console.log('❌ ERROR YTSEARCH:', e);
				enviar('❌ Error buscando videos en YouTube');
			}
		},
	},

	// === PLAY VIDEO (YTMp4) ===
	playvideo: {
		aliases: ['playvideo', 'ytmp4'],
		handler: async ({ q, from, isReg, enviar, respuesta, sock, info, APINAUFRA, NAUFRA_KEY }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (!q) return enviar('❌ Escribe un nombre o link de YouTube');

			try {
				const apiURL = `${APINAUFRA}/ytinfo?apikey=${NAUFRA_KEY}&url=${encodeURIComponent(q.trim())}`;
				const apiData = await fetchJson(apiURL);

				if (apiData?.Estado === 'online') {
					const data = apiData.Resultado;
					await sock.sendMessage(from, {
						image: { url: data.Miniatura },
						caption: `「✪」 *${data.Titulo}*\n\n*ⴵ Duración:* ${data.Duracion}\n*✐ Canal:* ${data.Canal.Nombre}\n*👁 Vistas:* ${data.Visualizaciones}\n*🜸 Link:* ${data.EnlaceYoutube}`,
					}, { quoted: info });

					await sock.sendMessage(from, {
						video: { url: `${data.EnlaceDescarga}&apikey=${NAUFRA_KEY}` },
						mimetype: 'video/mp4',
						caption: data.Titulo,
					}, { quoted: info });
					return;
				}

				// Fallback
				const videoURL = `${APINAUFRA}/ytmp4?apikey=${NAUFRA_KEY}&url=${encodeURIComponent(q.trim())}`;
				await sock.sendMessage(from, { video: { url: videoURL }, mimetype: 'video/mp4', caption: q }, { quoted: info });
			} catch (e) {
				console.log('ERROR PLAYVIDEO:', e);
				enviar('❌ Error descargando video');
			}
		},
	},

	// === PLAY DOCUMENT (YTMp4 doc) ===
	playdoc: {
		aliases: ['playdoc'],
		handler: async ({ q, from, isReg, enviar, respuesta, sock, info, APINAUFRA, NAUFRA_KEY }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (!q) return enviar('❌ Escribe un nombre o link de YouTube');

			try {
				const apiURL = `${APINAUFRA}/ytinfo?apikey=${NAUFRA_KEY}&url=${encodeURIComponent(q.trim())}`;
				const apiData = await fetchJson(apiURL);

				if (apiData?.Estado === 'online') {
					const data = apiData.Resultado;
					await sock.sendMessage(from, {
						image: { url: data.Miniatura },
						caption: `「✪」 *${data.Titulo}*\n\n*ⴵ Duración:* ${data.Duracion}\n*✐ Canal:* ${data.Canal.Nombre}\n*👁 Vistas:* ${data.Visualizaciones}\n*🜸 Link:* ${data.EnlaceYoutube}`,
					}, { quoted: info });

					await sock.sendMessage(from, {
						document: { url: `${data.EnlaceDescarga}&apikey=${NAUFRA_KEY}` },
						mimetype: 'video/mp4',
						fileName: `${data.Titulo}.mp4`,
					}, { quoted: info });
					return;
				}

				const videoURL = `${APINAUFRA}/ytmp4?apikey=${NAUFRA_KEY}&url=${encodeURIComponent(q.trim())}`;
				await sock.sendMessage(from, { document: { url: videoURL }, mimetype: 'video/mp4', fileName: `video.mp4` }, { quoted: info });
			} catch (e) {
				console.log('ERROR MP4DOC:', e);
				enviar('❌ Error enviando documento');
			}
		},
	},

	// === SHIP (calculadora de amor) ===
	ship: {
		aliases: ['ship'],
		handler: async ({ from, isReg, enviar, respuesta, info, sock, APINAUFRA, NAUFRA_KEY }) => {
			if (!isReg) return enviar(respuesta.registro);

			const mentioned = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
			if (!mentioned || mentioned.length < 2) {
				return enviar('💞 Menciona a dos personas para calcular su *nivel de amor* 💘');
			}

			const user1 = mentioned[0];
			const user2 = mentioned[1];
			const loveRate = Math.floor(Math.random() * 100) + 1;

			let foto1, foto2;
			try { foto1 = await sock.profilePictureUrl(user1, 'image'); } catch { foto1 = 'https://i.postimg.cc/VkqDjMdJ/75499-coraz-el-dia-de-san-valentin-amor-corazon-de-amor-x750.jpg'; }
			try { foto2 = await sock.profilePictureUrl(user2, 'image'); } catch { foto2 = 'https://i.postimg.cc/VkqDjMdJ/75499-coraz-el-dia-de-san-valentin-amor-corazon-de-amor-x750.jpg'; }

			const fondo = 'https://telegra.ph/file/394705b02d10509c435cf.jpg';
			const shipImg = `${APINAUFRA}/api/canvas/ship?apikey=${NAUFRA_KEY}&foto1=${encodeURIComponent(foto1)}&foto2=${encodeURIComponent(foto2)}&fundo=${encodeURIComponent(fondo)}&mat=${loveRate}`;

			await sock.sendMessage(from, {
				image: { url: shipImg },
				caption: `💘 *𝐂𝐀𝐋𝐂𝐔𝐋𝐀𝐃𝐎𝐑 𝐃𝐄 𝐀𝐌𝐎𝐑* 💘

@${user1?.split('@')[0]} 💖 @${user2?.split('@')[0]}

• *${loveRate}% de Amor Eterno* 🌹`,
				mentions: [user1, user2],
			}, { quoted: info });
		},
	},

	// === EMOJIMIX ===
	emojimix: {
		aliases: ['emojimix'],
		handler: async ({ q, from, isReg, enviar, respuesta, sock, info, economy, coins }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (coins < 1) return enviar(respuesta.coins);
			if (!q) return enviar('🔁 Combina emojis. Ejemplo: *!emojimix 😊+😂*');

			enviar('`🔁 Mezclando...`');

			try {
				const [emoji1, emoji2] = q.split('+');
				const em = await fetchJson(
					`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`,
				);

				for (const res of em.results) {
					sock.sendMessage(from, { image: { url: res.url, quoted: info } }, { quoted: info });
					await economy.delkoin(sender, 1);
					await economy.addXp(sender, 1);
				}
			} catch (err) {
				enviar('❌ Ocurrió un error, intenta con otros emojis.');
			}
		},
	},
};

export default toolCommands;