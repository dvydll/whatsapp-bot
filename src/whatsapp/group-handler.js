/**
 * Handler de eventos de grupo - extraído de index.js
 * Maneja bienvenidas, despedidas y cambios de admins
 */

/**
 * @param {string} group
 * @param {string} participant
 * @param {number} membersCount
 * @returns {string} Mensaje de bienvenida para nuevo miembro
 */
const getWelcomeCaption = (group, participant) =>
	`𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐨/𝐚 𝐚𝐥 𝐠𝐫𝐮𝐩𝐨 *${group}* @${participant?.split('@')[0]} 🤍

✧ 𝐏𝐚𝐫𝐚 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐚𝐫𝐭𝐞, 𝐞𝐬𝐜𝐫𝐢𝐛𝐞:
* 𝐍𝐨𝐦𝐛𝐫𝐞
* 𝐄𝐝𝐚𝐝
* 𝐏𝐚𝐢́𝐬
* 𝐅𝐨𝐭𝐨 𝐨 𝐯𝐢𝐝𝐞𝐨

❀ 𝐒𝐢́ 𝐞𝐬 𝐨𝐛𝐥𝐢𝐠𝐚𝐭𝐨𝐫𝐢𝐨 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐚𝐫𝐬𝐞, 𝐚𝐬𝐢́ 𝐩𝐨𝐝𝐞𝐦𝐨𝐬 𝐜𝐨𝐧𝐨𝐜𝐞𝐫𝐧𝐨𝐬 𝐦𝐞𝐣𝐨𝐫 𝐲 𝐜𝐫𝐞𝐚𝐫 𝐮𝐧 𝐚𝐦𝐛𝐢𝐞𝐧𝐭𝐞 𝐦𝐚́𝐬 𝐜𝐞𝐫𝐜𝐚𝐧𝐨 𝐲 𝐚𝐠𝐫𝐚𝐝𝐚𝐛𝐥𝐞 𝐩𝐚𝐫𝐚 𝐭𝐨𝐝𝐨𝐬.`;

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
			// const welcomeImg = 'https://i.ibb.co/HDf3hw9J/20250702-214923.jpg';
			const welcomeImg = 'https://c.tenor.com/727qo8TxQjcAAAAd/tenor.gif';
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
		console.debug(
			'[createGroupHandler] group-participants.update event',
			JSON.stringify(
				{
					id,
					author,
					action,
					participants,
				},
				null,
				2,
			),
		);

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
