/**
 * Comandos de Grupo
 */

import fs from 'node:fs';
import { obtenerMencionado } from '../whatsapp/utils/mention-utils.js';

export const groupCommands = {
	// === BIENVENIDA ===
	welcome: {
		aliases: ['welcome', 'bienvenida'],
		handler: async ({ args, from, isGroup, isGroupAdmins, isBotGroupAdmins, enviar, isWelcome, welcome }) => {
			if (!isGroup) return;
			if (args.length < 1) return enviar('「 𝟏 𝐏𝐚𝐫𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐫 𝐲 𝟎 𝐏𝐚𝐫𝐚 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐫 」 ');
			if (!isGroupAdmins) return enviar('❌ Solo administradores pueden usar este comando');
			if (!isBotGroupAdmins) return enviar('El bot necesita ser administrador');

			if (Number(args[0]) === 1) {
				if (isWelcome) return enviar('「 ✅ 𝐋𝐚 𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚 𝐘𝐚 𝐄𝐬𝐭𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐝𝐚 𝐄𝐧 𝐄𝐥 𝐆𝐫𝐮𝐩𝐨 」 ');
				welcome.push(from);
				fs.writeFileSync('./settings/Grupo/Json/welcome.json', JSON.stringify(welcome));
				enviar('「 ✅ 𝐀𝐜𝐭𝐢𝐯𝐚𝐝𝐨 𝐄𝐱𝐢𝐭𝐨𝐬𝐚𝐦𝐞𝐧𝐭𝐞 」');
			} else if (Number(args[0]) === 0) {
				if (!isWelcome) return enviar('「 ❌ 𝐋𝐚 𝐛𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚 𝐧𝐨 𝐞𝐬𝐭𝐚 𝐚𝐜𝐭𝐢𝐯𝐚𝐝𝐚」');
				welcome.splice(from, 1);
				fs.writeFileSync('./settings/Grupo/Json/welcome.json', JSON.stringify(welcome));
				enviar('❌ 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐝𝐨 𝐞𝐱𝐢𝐭𝐨𝐬𝐚𝐦𝐞𝐧𝐭𝐞 ');
			} else {
				enviar('「 𝟏 𝐏𝐚𝐫𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐫 𝐲 𝟎 𝐏𝐚𝐫𝐚 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐫 」');
			}
		},
	},

	// === BANGP ===
	bangp: {
		aliases: ['bangp'],
		handler: async ({ args, from, isGroup, isOwner, enviar, respuesta }) => {
			if (!isGroup) return;
			if (!isOwner) return enviar(respuesta.miowner);
			// TODO: pasar bngp por contexto
			enviar('⚠️ Comando en migración');
		},
	},

	// === TODOS / REVIVIR ===
	todos: {
		aliases: ['todos', 'revivir'],
		handler: async ({ body, from, isGroup, isReg, isGroupAdmins, enviar, respuesta, groupMembers, mentions, sender }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (!isGroup) return enviar('Es en serio invocar en un chat');
			if (!isGroupAdmins) return enviar(respuesta.admin);

			const teks = body.slice(8).trim();
			const members_id = [];
			let msg = `🗣️💬 ❝¡𝑳𝑳𝒂𝒎𝒂𝒅𝒂 𝒂 𝒕𝒐𝒅𝒐 𝑬𝒍 𝑴𝒖𝒏𝒅𝒐!❞ \n\n`;
			msg += `𝐓𝐎𝐓𝐀𝐋 : ${groupMembers.length}\n`;
			let nu = 0;
			for (const mem of groupMembers) {
				nu += 1;
				msg += ` ➫[${nu}] @${mem.id?.split('@')[0]}\n`;
				members_id.push(mem.id);
			}
			mentions(msg, members_id, true);
		},
	},

	// === ANUNCIO ===
	anuncio: {
		aliases: ['anuncio'],
		handler: async ({ args, q, from, isGroup, isGroupAdmins, enviar, respuesta, groupMembers, mentions }) => {
			if (!isGroup) return enviar('Es en serio invocar en un chat');
			if (!isGroupAdmins) return enviar(respuesta.admin);

			const men = [];
			let num = 0;
			let teks = `🗣💬 ❝𝑨𝒕𝒆𝒏𝒄𝒊ó𝒏 𝒂 𝒆𝒔𝒕𝒆 𝑨𝒏𝒖𝒏𝒄𝒊𝒐.❞ 👉 ❝ ${q} ❞ 👈 \n`;
			for (const m of groupMembers) {
				num += 1;
				teks += `• [${num}] @${m.id?.split('@')[0]}\n`;
				men.push(m.id);
			}
			mentions(teks, men, true);
		},
	},

	// === HIDETAG / NOTIFY ===
	hidetag: {
		aliases: ['hidetag', 'notify'],
		handler: async ({ q, from, isGroup, isReg, isGroupAdmins, enviar, respuesta, sock, info }) => {
			if (!isReg) return enviar(respuesta.registro);
			if (!isGroupAdmins) return enviar(respuesta.admin);
			if (!q) return enviar('Digite un texto ejemplo !notify hola hermanos 🔥');

			const group = await sock.groupMetadata(from);
			const mem = group.participants.map((adm) => adm.id.replace('c.us', 's.whatsapp.net'));
			sock.sendMessage(from, {
				text: q,
				contextInfo: { mentionedJid: mem },
				quoted: info,
			});
		},
	},

	// === KICK / BAN ===
	kick: {
		aliases: ['kick', 'ban', 'largate'],
		handler: async ({ from, isGroup, isGroupAdmins, isBotGroupAdmins, enviar, respuesta, sock, info, BotNumber, owner }) => {
			if (!isGroup) return;
			if (!isGroupAdmins) return enviar(respuesta.admin);
			if (!isBotGroupAdmins) return enviar(respuesta.botadmin);

			const mentioned = obtenerMencionado(info);
			if (!mentioned) return enviar('⚠️ Debes mencionar a alguien para usar este comando.');
			if (mentioned === BotNumber || mentioned === owner) return enviar('🤨');

			await sock.groupParticipantsUpdate(from, [mentioned], 'remove');
			enviar('Accion realizada exitosamente');
		},
	},

	// === ANTILINK ===
	antilink: {
		aliases: ['antilink'],
		handler: async ({ args, from, isGroup, isGroupAdmins, isBotGroupAdmins, enviar, respuesta, antilink }) => {
			if (!isGroup) return;
			if (!isGroupAdmins) return enviar(respuesta.admin);
			if (!isBotGroupAdmins) return enviar(respuesta.botadmin);
			if (args.length < 1) return enviar('DIGITE 1 PARA ACTIVAR Y 0 PARA DESACTIVAR');

			if (Number(args[0]) === 1) {
				if (antilink.includes(from)) return enviar('✅ El antilink ya está activado');
				antilink.push(from);
				fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink, null, 2));
				enviar('✅ ANTLINK ACTIVADO');
			} else if (Number(args[0]) === 0) {
				if (!antilink.includes(from)) return enviar('❌ El antilink ya está desactivado');
				const index = antilink.indexOf(from);
				antilink.splice(index, 1);
				fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink, null, 2));
				enviar('❌ ANTLINK DESACTIVADO');
			} else {
				enviar('DIGITE 1 PARA ACTIVAR Y 0 PARA DESACTIVAR');
			}
		},
	},

	// === GRUPO ABRIR/CERRAR ===
	grupo: {
		aliases: ['grupo'],
		handler: async ({ args, from, isGroup, isGroupAdmins, isBotGroupAdmins, enviar, sock }) => {
			if (!isGroup) return enviar('Este comando solo funciona en grupos');
			if (!isGroupAdmins) return enviar('Solo administradores');
			if (!isBotGroupAdmins) return enviar('El bot necesita ser administrador');

			if (!args[0]) {
				return enviar('⚙️ *Configuración del grupo*\n\n• */grupo abrir* → Abrir el grupo\n• */grupo cerrar* → Cerrar el grupo');
			}

			if (args[0] === 'abrir') {
				await sock.groupSettingUpdate(from, 'not_announcement');
				enviar('🟢 *GRUPO ABIERTO*\n\nAhora todos los miembros pueden enviar mensajes.');
			} else if (args[0] === 'cerrar') {
				await sock.groupSettingUpdate(from, 'announcement');
				enviar('🔒 *GRUPO CERRADO*\n\nSolo los administradores pueden enviar mensajes.');
			} else {
				enviar('⚠️ Opción inválida. Usa */grupo abrir* o */grupo cerrar*');
			}
		},
	},

	// === MODO ADMIN ===
	modoadmin: {
		aliases: ['modoadmin'],
		handler: async ({ args, from, isGroup, isGroupAdmins, enviar }) => {
			if (!isGroup) return enviar('⚠️ Este comando solo se puede usar en grupos.');
			if (!isGroupAdmins) return enviar('🚫 Solo los administradores pueden cambiar este modo.');

			const JsonModoAdmin = './settings/Grupo/Json/modo_admin.json';
			let modoAdmin = JSON.parse(fs.readFileSync(JsonModoAdmin));
			const estado = args[0];

			if (!estado) {
				return enviar('🧩 Usa el comando correctamente:\n\n*modoadmin 1* → Activar modo admin\n*modoadmin 0* → Desactivar modo admin');
			}

			if (estado === '1') {
				if (!modoAdmin.includes(from)) {
					modoAdmin.push(from);
					fs.writeFileSync(JsonModoAdmin, JSON.stringify(modoAdmin, null, 2));
					enviar('✅ *Modo admin activado* — Ahora solo los administradores pueden usar el bot en este grupo.');
				} else {
					enviar('⚠️ El modo admin ya estaba activado en este grupo.');
				}
			} else if (estado === '0') {
				if (modoAdmin.includes(from)) {
					modoAdmin = modoAdmin.filter((g) => g !== from);
					fs.writeFileSync(JsonModoAdmin, JSON.stringify(modoAdmin, null, 2));
					enviar('🟢 *Modo admin desactivado* — Todos los miembros pueden usar el bot nuevamente.');
				} else {
					enviar('⚠️ El modo admin ya estaba desactivado en este grupo.');
				}
			} else {
				enviar('❌ Solo puedes usar *1* para activar o *0* para desactivar.');
			}
		},
	},
};

export default groupCommands;