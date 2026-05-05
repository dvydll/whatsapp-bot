/**
 * Handler de eventos de grupo - extraído de index.js
 * Maneja bienvenidas, despedidas y cambios de admins
 */

import chalk from 'chalk';

const { color } = chalk;

/**
 * @param {string} group
 * @param {string} participant
 * @param {number} membersCount
 * @returns {string} Mensaje de bienvenida para nuevo miembro
 */
const getWelcomeCaption = (
	group,
	participant,
	membersCount,
) => `💌 「 Bienvenid@ a *${group}* @${participant?.split('@')[0]} 
『 👥 Miembros actuales: ${membersCount} 』`;

/**
 * @param {string} participant
 * @param {Object} metadata
 * @returns {string} Mensaje de bienvenida para nuevo admin
 */
const getPromoteCaption = (participant, metadata) => `
✦━─┈༓༒༓───┈━✦

     *✧༺ 𝓝𝓾𝓮𝓿𝓸 𝓐𝓭𝓶𝓲𝓷 ༻✧*

🪪 𝗡𝗼𝗺𝗯𝗿𝗲: @${participant?.split('@')[0]}
🌐 𝗚𝗿𝘂𝗽𝗼: ${metadata.subject}
💌 「 ¡Enhorabuena! 🎉 Has ascendido a la mesa de los administradores 🪄 」

✦━─┈༓༒༓─┈━✦
`;

/**
 * Crea un handler para eventos de grupo
 * @param {import("baileys").WASocket} sock - Socket de Baileys
 * @param {*} anu
 */
const handlerFactory = async (sock, jid) => {
	const groupMetadata = await sock.groupMetadata(jid);
	return {
		/**
		 * Bienvenida - usuario se une al grupo
		 */
		add: async (participant) => {
			const welcomeImg = 'https://i.ibb.co/HDf3hw9J/20250702-214923.jpg';
			const group = groupMetadata.subject;
			const membersCount = groupMetadata.participants.length;

			await sock.sendMessage(jid, {
				image: { url: welcomeImg },
				caption: getWelcomeCaption(group, participant, membersCount),
				mentions: [participant],
			});
		},
		/**
		 * Promote - usuario se vuelve administrador
		 */
		promote: async (participant) => {
			const promoteImg = 'https://i.postimg.cc/0ygy14nq/20251017-152852.jpg';
			const caption = getPromoteCaption(participant, groupMetadata);

			await sock.sendMessage(jid, {
				image: { url: promoteImg },
				caption,
			});
		},
	};
};

/**
 * Crea el handler de grupos
 * @param {import("baileys").WASocket} sock - Socket de Baileys
 * @param {Object} config - Config del grupo (welcome, etc.)
 * @returns {Function} Handler para group-participants.update
 */
const createGroupHandler = (sock, config = {}) => {
	const { welcome = [] } = config;

	/**
	 * Handler para eventos de grupo
	 * @param {import('baileys').BaileysEventMap['group-participants.update']} ev group-participants.update event
	 */
	return async ({ id, author, action, participants }) => {
		// Debug: ver todos los eventos de grupo
		console.debug('[createGroupHandler] group-participants.update event', {
			id,
			author,
			action,
			participants,
		});

		try {
			const { add, promote } = await handlerFactory(sock, id);
			for (const participant of participants) {
				// Solo procesar si las bienvenidas están activas
				if (action === 'add' && welcome.includes(id)) add(participant);
				if (action === 'promote') promote(participant);
			}
		} catch (e) {
			console.error('[createGroupHandler] ERROR', e);
		}
	};
};

export { createGroupHandler };
