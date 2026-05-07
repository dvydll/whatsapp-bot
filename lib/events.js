import { readFileSync } from 'node:fs';
import { createSocket } from './instance.js';
import { handleMessage } from './message-handler.js';
import { createGroupHandler } from './whatsapp/group-handler.js';
import { onConnectionUpdate } from './whatsapp/handlers/connection.js';

/**
 * Configuración de grupos desde settings
 */
const loadGroupConfig = () => ({
	welcome: JSON.parse(readFileSync('./settings/Grupo/Json/welcome.json')),
});

/**
 * Bind de eventos al socket
 * @param {Awaited<ReturnType<typeof createSocket>>} refs - Referencias mutables { sock, saveCreds }
 * @param {Function} onMessages - Handler de mensajes
 */
export function bindEvents(refs) {
	const { sock, saveCreds } = refs;
	const groupConfig = loadGroupConfig();

	// 1. Conexión - reconnect actualiza refs y re-vincula
	sock.ev.on('connection.update', onConnectionUpdate(async () => {
		console.info('[events] Reconectando...');
		const newRefs = await createSocket();
		refs.sock = newRefs.sock;
		refs.saveCreds = newRefs.saveCreds;
		// Re-vincular con nuevas refs
		bindEvents(refs);
	}));

	// 2. Credenciales
	sock.ev.on('creds.update', saveCreds);

	// 3. Participantes de grupo
	sock.ev.on(
		'group-participants.update',
		createGroupHandler(sock, groupConfig),
	);

	// 4. Mensajería
	sock.ev.on('messages.upsert', handleMessage(sock));

	console.info('[events] Eventos vinculados correctamente');
}