/**
 * Connection handler - extraído de index.js
 * Maneja connection.update events
 */

import { Boom } from '@hapi/boom';
import { DisconnectReason } from 'baileys';
import { exec } from 'node:child_process';

// Mensajes de conexión
const connectionMessages = {
	open: '✅ Conectado exitosamente',
	close: '⚠️ Conexión cerrada, reconectando...',
	connecting: '⌛ Conectando...',
};

const onOpenConnection = () => {
	console.info(`[createConnectionHandler] ${connectionMessages.open}`);
	// Limpiar tmp
	exec('rm -rf tmp && mkdir tmp', (err) => {
		if (err) console.error('Error cleaning tmp:', err);
	});
};

/**
 * @param {import('baileys').BaileysEventMap['connection.update']['lastDisconnect']} lastDisconnect
 * @param {Function} onDisconect Callback para reconectar
 */
const onCloseConnection = (lastDisconnect, onDisconnect) => {
	// Determinar razón de desconexión
	const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

	if (reason === DisconnectReason.loggedOut) {
		console.info(
			'[createConnectionHandler]',
			'❌ Sesión cerrada. Borra la carpeta "session" y vuelve a emparejar.',
		);
		return; // No reconectar automáticamente
	}

	console.info(`[createConnectionHandler] ${connectionMessages.close}`);
	onDisconnect?.(); // Reconectar
};

/**
 * Crea el handler de conexión
 * @param {Function} onDisconnect - Callback cuando se desconecta
 */
export const onConnectionUpdate =
	(onDisconnect) =>
	/**
	 * @param {import('baileys').BaileysEventMap['connection.update']} ev
	 */
	async ({ connection, lastDisconnect }) => {
		if (connection === 'open') return onOpenConnection();
		if (connection === 'close') onCloseConnection(lastDisconnect, onDisconnect);
	};
