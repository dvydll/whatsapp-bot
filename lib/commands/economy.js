/**
 * Comandos de Economía y Perfil
 */

import fs from 'node:fs';

export const economyCommands = {
	// === REGISTRO ===
	reg: {
		aliases: ['reg', 'registrarme', 'registrame', 'rg'],
		handler: async ({ sender, from, isReg, enviar, pushname, economy, respuesta, sock, info, JpgBot }) => {
			if (isReg) return enviar(respuesta.yaregistro);
			await economy.AddReg(sender, pushname);
			sock.sendMessage(from, {
				image: { url: JpgBot },
				caption: `★━━━━★━━━━★★━━━━★
         *༻ 𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐎 ༺*
🎉𝑅𝑒𝑔𝑖𝑠𝑡𝑟𝑜 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝐚𝐝𝐨 *${pushname}* 🥳
🪙𝑹𝒆𝒄𝒊𝒃𝒊𝒔𝒕𝒆 *₹50 Rupias* 🪙 𝒄𝒐𝒎𝒐 𝑹𝒆𝒈𝒂𝒍𝒐 𝒅𝒆 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒂.
◆━━━━━━━▣✦▣━━━━━━━━◆`,
			},
			{ quoted: info });
		},
	},

	// === PERFIL ===
	perfil: {
		aliases: ['perfil', 'cartera', 'nivel', 'minivel'],
		handler: async ({ sender, from, isReg, enviar, respuesta, sock, info, pushname, economy, rangos }) => {
			if (!isReg) return enviar(respuesta.registro);

			const saldo = economy.MoneyOfSender(sender);
			const Xp = economy.xpOfsender(sender);
			const Mnv = economy.levelOfsender(sender);
			const Rxxp = economy.Rxp(sender);
			const myrep2 = economy.repUser(sender);

			const YouN = economy.levelOfsender(sender);
			const Mlevel = rangos[YouN] || '🎖️𝐒𝐢𝐧 𝐑𝐚𝐧𝐠𝐨🎖️';
			const Mrxp = calculateProgress(Xp, Rxxp);

			let foto;
			try {
				foto = await sock.profilePictureUrl(sender, 'image');
			} catch {
				foto = 'https://i.postimg.cc/85NsPp8j/20260131-152616.jpg';
			}

			const Mp = `
╔══✦❖【 𝑻𝒖 𝑷𝒆𝒇𝒊𝒍 】❖✦══╗
🏷️  𝐍𝐨𝐦𝐛𝐫𝐞      »  @${sender?.split('@')[0]}
⚔️  𝐑𝐚𝐧𝐠𝐨       »  ${Mlevel}
👑  𝐑𝐞𝐩𝐮𝐭𝐚𝐜𝐢𝐨́𝐧  »  ${myrep2}
💰  𝐃𝐢𝐧𝐞𝐫𝐨     »  ₹${saldo} 𝐑𝐮𝐩𝐢𝐚𝐬
📈  𝐍𝐢𝐯𝐞𝐥       »  ${Mnv} ➜ ${Mnv + 1}
📚  𝐄𝐗𝐏         »  ${Xp} / ${Rxxp + 1000}
╚══✦❖【 𝐏𝐫𝐨𝐠𝐫𝐞𝐬𝐨 】❖✦══╝
▰▰ ${Mrxp} ▰▰
`;
			sock.sendMessage(from, {
				image: { url: foto },
				caption: Mp,
				mentions: [sender],
			},
			{ quoted: info });
		},
	},

	// === REPUTACIÓN ===
	rep: {
		aliases: ['rep', 'mirep', 'mireputacion'],
		handler: async ({ sender, from, isReg, enviar, respuesta, sock, info, pushname, economy }) => {
			if (!isReg) return enviar(respuesta.registro);
			const myrep = economy.repUser(sender);
			const mitulamide30milimetros = `╭━━━╾⭑✦REPUTACIÓN✦⭑╼━━━╮
𝑳𝒂 𝑹𝒆𝒑𝒖𝒕𝒂𝒄𝒊ó𝒏 𝒅𝒆 ${pushname} 𝒆𝒔 𝒅𝒆 ${myrep}.`;
			const images = [
				'https://i.postimg.cc/NfJfvsBW/Untitled-05-12-2024-09-16-50-1.png',
				'https://i.postimg.cc/PxjdQNQ8/Untitled-05-12-2024-09-16-50-2.png',
				'https://i.postimg.cc/HL5pMbXg/Untitled-05-12-2024-09-16-50-3.png',
				'https://i.postimg.cc/brWX3NWB/IMG-20241223-WA0014.jpg',
				'https://i.postimg.cc/Cx9hdcZ7/Untitled-05-12-2024-09-16-50-5.png',
			];
			const imgIndex = myrep < 20 ? 0 : myrep <= 40 ? 1 : myrep <= 60 ? 2 : myrep <= 80 ? 3 : 4;

			sock.sendMessage(from, {
				image: { url: images[imgIndex] },
				caption: mitulamide30milimetros,
			}, { quoted: info });
		},
	},

	// === REGALAR / TRADECOIN ===
	tradecoin: {
		aliases: ['regalar', 'tradecoin', 'enviarcoins', 'enviar'],
		handler: async ({ sender, from, isGroup, args, enviar, sock, info, economy, sleep, respuesta }) => {
			if (!isGroup) return enviar('⚠️ Este comando solo funciona en grupos.');

			const mencionado = obtenerMencionado(info);
			const monto = Number(args[1]);

			if (!mencionado) return enviar('⚠️ Debes mencionar a alguien para enviarle monedas.\nEj: .regalar @usuario 100');
			if (mencionado === sender) return enviar('⚠️ No puedes enviarte monedas a ti mismo.');
			if (Number.isNaN(monto) || monto <= 0) return enviar('⚠️ Ingresa una cantidad válida.');

			const saldoEmisor = economy.MoneyOfSender(sender);
			if (saldoEmisor < monto) return enviar('❌ No tienes suficientes monedas.');

			await economy.delkoin(sender, monto);
			await economy.addkoin(mencionado, monto);
			await sleep(100);

			enviar(`✅ Transferencia completada.\nUsted envió *₹${monto} Rupias.*`, { mentions: [sender, mencionado] });
		},
	},

	// === LEVELUP ===
	levelup: {
		aliases: ['levelup'],
		handler: async ({ sender, from, enviar, sock, info, economy, sleep }) => {
			const XpR = economy.xpOfsender(sender);
			const Rxxp = economy.Rxp(sender);
			if (XpR >= Rxxp + 1000) {
				await economy.addLevel(sender, 1);
				sleep(100);
				await economy.addkoin(sender, 10);
				sleep(100);
				await economy.addXp(sender, 100);
				sleep(100);
				await economy.addRxp(sender, 1000);
				const Mup = `★━━━ 𝐒𝐔𝐁𝐈𝐒𝐓𝐄 𝐃𝐄 𝐍𝐈𝐕𝐄𝐋 ━━━★
✪ @${sender?.split('@')[0]}
🎉 ¡𝑭𝒆𝒍𝒊𝒄𝒊𝒅𝒂𝒅𝒆𝒔 𝒉𝒂𝒔 𝒅𝒆𝒔𝒃𝒍𝒐𝒒𝒖𝒆𝒂𝒅𝒐 𝒖𝒏 𝒏𝒖𝒆𝒯𝒐 𝒓𝒂𝒏𝒈𝒐! 💪`;
				sock.sendMessage(from, { text: Mup, mentions: [sender] }, { quoted: info });
			} else {
				enviar('❌ Experiencia insuficiente. ¡Sigue entrenando!');
			}
		},
	},

	// === TIENDA ===
	tienda: {
		aliases: ['tienda'],
		handler: async ({ q, from, isReg, enviar, respuesta, coins, pushname, economy }) => {
			if (!isReg) return enviar(respuesta.registro);

			if (!q) {
				return enviar(`
✦━───༺༻───━✦
🎀❖ 𝓣𝓘𝓔𝓝𝓓𝓐 ❖🎀
🐾💬 "𝓑𝓲𝓮𝓷𝓿𝓮𝓷𝓲𝓭𝓸 𝓪 𝓵𝓪 𝓽𝓲𝓮𝓷𝓭𝓪 🌙"
━━━━━━━━━━━━━━━
🍀 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 1️⃣: 👉 *.tienda 1* 👈 | 50 Coins 🔁 200 EXP
🌟 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 2️⃣: 👉 *.tienda 2 <nivel> <nombre>* 👈 | 50 Coins 🔁 Cambiar nombre de rango
💎 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 3️⃣: 👉 *.emojimix 😇+😈* 👈 | 1 Coin 🔁 Combinar emojis
🎨 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 4️⃣: 👉 *.sticker* 👈 | 1 Coin 🔁 Crear stickers
✦━───༺༻───━✦`);
			}

			if (q.startsWith('1')) {
				if (coins < 50) return enviar('❌ Necesitas al menos 50 Rupias.');
				await economy.delkoin(sender, 50);
				await economy.addXp(sender, 200);
				return enviar(`🐱💬 Gracias ${pushname}, cambiaste 50 Rupias por 200 EXP.`);
			}

			if (q.startsWith('2')) {
				const parts = q.split(' ');
				const nivel = parseInt(parts[1], 10);
				const nuevoNombre = parts.slice(2).join(' ');
				if (Number.isNaN(nivel) || !nuevoNombre) {
					return enviar('❌ Usa: .tienda 2 <nivel> <nuevo nombre>');
				}
				if (coins < 50) return enviar('❌ Necesitas 50 Coins para cambiar rangos.');

				const path = './settings/rangos.json';
				let rangosData = JSON.parse(fs.readFileSync(path));
				rangosData[nivel] = nuevoNombre;
				fs.writeFileSync(path, JSON.stringify(rangosData, null, 2));
				await economy.delkoin(sender, 50);
				return enviar(`✅ ¡Perfecto, ${pushname}!\nHas cambiado el rango del nivel *${nivel}* a:\n✨ *${nuevoNombre}* ✨`);
			}
		},
	},

	// === RANKING REPUTACIÓN ===
	rankrep: {
		aliases: ['rank', 'rankrep'],
		handler: async ({ from, isGroup, isGroupAdmins, enviar, respuesta, registro }) => {
			if (!isGroup) return;
			if (!isGroupAdmins) return enviar(respuesta.admin);

			let teks = `▭▬ ۞ ▬▛ ༼⁠ᘛ 𝑳𝒖𝒏𝒂-𝑩𝒐𝒕 ᘚ༽ ▜▬ ۞ ▬▭
*༻❦ 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 𝐃𝐄 𝐑𝐄𝐏𝐔𝐓𝐀𝐂𝐈𝐎𝐍 ❦༺\n`;

			registro
				.sort((a, b) => b.rep - a.rep)
				.slice(0, 10)
				.forEach((usuario, indice) => {
					teks += `• 🚩Numero ${indice + 1}: *${usuario.nombre}* | *${usuario.rep}* de Reputación\n`;
				});
			enviar(teks);
		},
	},

	// === RANKING COINS ===
	rankcoins: {
		aliases: ['rankcoins'],
		handler: async ({ from, isGroup, isGroupAdmins, enviar, respuesta }) => {
			if (!isGroup) return;
			if (!isGroupAdmins) return enviar(respuesta.admin);

			const pathi = './settings/Grupo/Json/registros.json';
			const registro = JSON.parse(fs.readFileSync(pathi, 'utf8'));

			let rankingMensaje = `*🏆 RANKING DE MILLONARIOS*\n\nTOP.  USUARIO.   RUPIAS\n\n`;

			const rankingArray = Array.isArray(registro)
				? registro
				: Object.entries(registro).map(([jid, data]) => ({
					nombre: data.nombre || jid?.split('@')[0],
					dinero: data.dinero || 0,
				}));

			rankingArray
				.sort((a, b) => b.dinero - a.dinero)
				.slice(0, 10)
				.forEach((usuario, index) => {
					rankingMensaje += `• ${index + 1}. *${usuario.nombre}* ➫ _${usuario.dinero}_ Rupias\n`;
				});

			enviar(rankingMensaje);
		},
	},

	// === RANKING NIVEL ===
	ranknivel: {
		aliases: ['ranknivel'],
		handler: async ({ from, isGroup, isGroupAdmins, enviar, respuesta, registro }) => {
			if (!isGroup) return;
			if (!isGroupAdmins) return enviar(respuesta.admin);

			let teks = `*RANKING DE NIVEL* :\nTOP.   USUARIO.   NIVEL\n`;
			registro
				.sort((a, b) => b.nivel - a.nivel)
				.forEach((usuario, index) => {
					teks += `• ${index + 1}.     *${usuario.nombre}*  ➫  _*${usuario.nivel}*_\n`;
				});
			enviar(teks);
		},
	},
};

// Helper para calcular barra de progreso
function calculateProgress(Crxp, Rrxp) {
	if (Crxp <= Rrxp + 50) return '*▒▒▒▒▒▒▒▒▒▒ 0%*';
	if (Crxp <= Rrxp + 100) return '*█▒▒▒▒▒▒▒▒▒ 10%*';
	if (Crxp <= Rrxp + 200) return '*██▒▒▒▒▒▒▒▒ 20%*';
	if (Crxp <= Rrxp + 300) return '*███▒▒▒▒▒▒▒ 30%*';
	if (Crxp <= Rrxp + 400) return '*████▒▒▒▒▒▒ 40%*';
	if (Crxp <= Rrxp + 500) return '*█████▒▒▒▒▒ 50%*';
	if (Crxp <= Rrxp + 600) return '*██████▒▒▒▒ 60%*';
	if (Crxp <= Rrxp + 700) return '*███████▒▒▒ 70%*';
	if (Crxp <= Rrxp + 800) return '*████████▒▒ 80%*';
	if (Crxp <= Rrxp + 999) return '*█████████▒ 90%*';
	if (Crxp >= Rrxp + 1000) return '*██████████ 100%*';
	return '*▒▒▒▒▒▒▒▒▒▒ 0%*';
}

// Import dinámico para evitar circular
async function obtenerMencionado(info) {
	const mod = await import('../whatsapp/utils/mention-utils.js');
	return mod.obtenerMencionado(info);
}

export default economyCommands;