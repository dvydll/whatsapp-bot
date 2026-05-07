/**
 * DayaBot - Entry Point
 * Refactorizado: instanciar, conectar, eventos, comandos
 */

import cfonts from 'cfonts';
import chalk from 'chalk';

// Módulos propios
import { requestPairingCode } from './lib/connect.js';
import { bindEvents } from './lib/events.js';
import { createSocket } from './lib/instance.js';

// Banner
const banner = cfonts.render('Daya| Bot', {
	font: 'pallet',
	align: 'center',
	gradient: ['green', 'blue'],
});

async function main() {
	console.info(banner.string);
	console.info(chalk.cyanBright('🔥 DayaBot'));

	// 1. Crear instancia del socket
	const { sock, saveCreds } = await createSocket();

	// 2. Solicitar código de vinculación si es necesario
	await requestPairingCode(sock);

	// 3. Crear refs mutables para reconnect
	const refs = { sock, saveCreds };

	// 4. Bind de eventos (incluye reconnect automático)
	bindEvents(refs);

	console.info('[main] Bot iniciado correctamente');
}

main().catch(console.error);