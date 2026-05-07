/**
 * Message Handler - Parser y router de mensajes
 * Extraído de index.js lines 180-415
 */

import fs from 'node:fs';

import { executeCommand } from './commands/index.js';
import { getQuotedTypes } from './core/types.js';
import economy from './systems/economy.js';
import { getRespuestas } from './utils/responses.js';

import cfg from '../settings/config.json' with { type: 'json' };

// Importaciones de juegos (cooldowns)
import { expiredClaim } from './systems/games/claim.js';
import {
  expiredAttp,
  expiredDayli,
  expiredEmoji,
  expiredEve,
  expiredMinar,
  expiredPescar,
  expiredRuleta,
} from './systems/games/mining.js';

const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Cargar prefijos de comandos (lazy)
let _cmdPrefix = null;
function getCmdPrefix() {
	if (!_cmdPrefix) {
		_cmdPrefix = cfg?.prefix || ['.'];
	}
	return _cmdPrefix;
}

/**
 * Extraer cuerpo del mensaje según tipo
 */
function extractBody(info, type) {
	switch (type) {
		case 'conversation':
			return info.message.conversation;
		case 'imageMessage':
			return info.message.imageMessage.caption || '';
		case 'videoMessage':
			return info.message.videoMessage.caption || '';
		case 'extendedTextMessage':
			return info.message.extendedTextMessage.text || '';
		case 'buttonsResponseMessage':
			return info.message.buttonsResponseMessage.selectedButtonId || '';
		case 'listResponseMessage':
			return info.message.listResponseMessage.singleSelectReply?.selectedRowId || '';
		case 'templateButtonReplyMessage':
			return info.message.templateButtonReplyMessage.selectedId || '';
		default:
			return '';
	}
}

/**
 * Crear contexto de mensaje
 */
function createMessageContext(messageInfo, sock) {
	const info = messageInfo.messages[0];

	// Verificar mensaje válido
	if (!info.message) return null;
	if (info.key?.remoteJid === 'status@broadcast') return null;

	// Extraer tipo y contenido
	const altpdf = Object.keys(info.message);
	const type = altpdf[0] === 'senderKeyDistributionMessage'
		? altpdf[1] === 'messageContextInfo' ? altpdf[2] : altpdf[1]
		: altpdf[0];

	const content = JSON.stringify(info.message);
	const from = info.key.remoteJid;

	// Extraer cuerpo del mensaje
	const body = extractBody(info, type);

	// Usuario
	const isGroup = from.endsWith('@g.us');
	const sender = isGroup ? info.key.participant : from;
	const pushname = info.pushName || '';

	// Cargar configuraciones
	const welcome = JSON.parse(fs.readFileSync('./settings/Grupo/Json/welcome.json'));
	const bngp = JSON.parse(fs.readFileSync('./settings/Grupo/Json/grupo.json'));
	const antilink = JSON.parse(fs.readFileSync('./settings/Grupo/Json/antilink.json'));
	const Antipv = JSON.parse(fs.readFileSync('./settings/Grupo/Json/chat.json'));
	const modoAdminList = JSON.parse(
		fs.existsSync('settings/Grupo/Json/modo_admin.json')
			? fs.readFileSync('settings/Grupo/Json/modo_admin.json')
			: '[]',
	);
	const botActivo = JSON.parse(
		fs.existsSync('settings/estadoBot.json')
			? fs.readFileSync('settings/estadoBot.json')
			: '{"activo": true}',
	).activo;

	// Flags de grupo
	const isWelcome = isGroup ? welcome.includes(from) : false;
	const isBanGp = isGroup ? bngp.includes(from) : false;
	const isAntiLink = isGroup ? antilink.includes(from) : false;
	const isAntipv = Antipv.includes('activo');
	const isModoAdmin = isGroup ? modoAdminList.includes(from) : false;
	const isReg = economy.checkOfReg(sender);
	const coins = economy.MoneyOfSender(sender);

	// Rangos
	const rangos = JSON.parse(fs.readFileSync('settings/rangos.json'));

	// Quoted types
	const quotedTypes = getQuotedTypes(type, content);
	const isQuotedVideo = quotedTypes.isQuotedVideo;
	const isQuotedSticker = quotedTypes.isQuotedSticker;

	// Configuración
	const config = {
		APINAUFRA: cfg.APINAUFRA,
		NAUFRA_KEY: cfg.NAUFRA_KEY,
		owner: cfg.owner,
		Bot: cfg.Bot,
		JpgBot: cfg.JpgBot,
	};

	// Bot number
	const BotNumber = `${sock.user?.id?.split(':')[0]}@s.whatsapp.net`;
	const isOwner = config.owner === sender;

	// Grupo metadata (simplificado - sincrono para evitar await)
	const groupMembers = [];
	const groupAdmins = [];
	const isGroupAdmins = false;
	const isBotGroupAdmins = false;

	// Parsear comando
	const lowerBody = body.toLowerCase();
	const cmdPrefix = getCmdPrefix();
	const hasPrefix = cmdPrefix.some((p) => lowerBody.startsWith(p.toLowerCase()));
	const prefixes = cmdPrefix.map((p) => p.toLowerCase());

	let comando = '';
	let args = [];

	if (hasPrefix) {
		const matchedPrefix = prefixes.find((p) => lowerBody.startsWith(p));
		const commandPart = lowerBody.slice(matchedPrefix.length).trim();
		const parts = commandPart.split(/\s+/);
		comando = removeAccents(parts[0] || '');
		args = parts.slice(1);
	}

	const q = args.join(' ');

	// Respuestas predefinidas
	const respuesta = getRespuestas(sender);

	// Funciones helpers
	const enviar = (texto, opts = {}) => {
		sock.sendMessage(from, { text: texto }, { quoted: info, ...opts });
	};

	const mentions = (txt, member) => {
		sock.sendMessage(from, { text: txt.trim(), mentions: member });
	};

	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	// Retornar contexto
	return {
		// Info mensaje
		info,
		from,
		type,
		body,
		comando,
		args,
		q,

		// Usuario
		sender,
		pushname,
		isOwner,
		isReg,

		// Grupo
		isGroup,
		groupMembers,
		groupAdmins,
		isGroupAdmins,
		isBotGroupAdmins,
		mentions,

		// Config
		BotNumber,
		welcome,
		bngp,
		antilink,
		Antipv,
		modoAdminList,
		botActivo,

		// Flags
		isWelcome,
		isBanGp,
		isAntiLink,
		isAntipv,
		isModoAdmin,
		coins,
		rangos,

		// Quoted
		isQuotedVideo,
		isQuotedSticker,

		// Respuestas
		respuesta,

		// Config
		...config,

		// Servicios
		economy,
		rangos,

		// Helpers
		enviar,
		mentions,
		sleep,
		sock,
	};
}

/**
 * Handler principal de mensajes
 * @param {import('baileys').WASocket} sock - Socket de Baileys
 * @returns {(ev: import('baileys').BaileysEventMap['messages.upsert']) => Promise<void>} Handler para messages.upsert
 */
export function handleMessage(sock) {
	return async (ev) => {
		console.debug('[handleMessage] messages.upsert event', JSON.stringify(ev, null, 2));

		try {
			// Limpiar cooldowns expirados
			expiredClaim();
			expiredMinar();
			expiredAttp();
			expiredEmoji();
			expiredEve();
			expiredDayli();
			expiredPescar();
			expiredRuleta();

			// Crear contexto
			const ctx = createMessageContext(ev, sock);
			if (!ctx) return;

			const { isBanGp, isAntipv, isOwner, isGroup, isModoAdmin, isGroupAdmins, botActivo, comando } = ctx;

			// Filtros de seguridad
			if (isBanGp) return;
			if (isAntipv && !isGroup && !isOwner) {
				await sock.updateBlockStatus(ctx.sender, 'block');
				return;
			}
			if (isModoAdmin && !isGroupAdmins && !isOwner) return;
			if (!botActivo && !isOwner) return;

			// Log en consola
			console.info(
				`[handleMessage] ${isGroup ? '[GRUPO]' : '[PV]'} ${ctx.pushname} (${ctx.sender})${comando ? ` ejecutó comando: ${comando}` : ''}`,
        JSON.stringify(
          {
            ...(ctx.isGroup && { groupName: ctx.groupName }),
            from: ctx.pushname,
            ...(comando && { command: comando }),
            message: ctx.body,
            time: new Date().toLocaleTimeString('es-ES', {
              timeZone: 'Europe/Madrid',
            }),
            date: new Date().toLocaleDateString('es-ES', {
              timeZone: 'Europe/Madrid',
            }),
          },
          null,
          2,
        ),
			);

			// Ejecutar comando
			if (comando) {
				executeCommand(comando, ctx);
			}
		} catch (e) {
			console.error('[handleMessage] ERROR:', e);
		}
	};
}

export default { handleMessage, createMessageContext };