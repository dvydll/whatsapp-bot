import chalk from 'chalk';
import readline from 'node:readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

export async function requestPairingCode(sock) {
	if (sock.authState.creds.registered) {
		return;
	}

	const input = await question(
		chalk.cyan('📱 Escribe tu número de WhatsApp con código de país (solo números): '),
	);
	rl.close();

	const number = input.replace(/[^0-9]/g, '');
	if (!number) {
		console.error(chalk.red('❌ Número inválido.'));
		process.exit(1);
	}

	console.info(chalk.yellow('⌛ Solicitando código de vinculación...'));

	try {
		const code = await sock.requestPairingCode(number);
		console.info(
			chalk.bgGreen.black('✅ CÓDIGO DE VINCULACIÓN:'),
			chalk.white(code),
		);
	} catch (err) {
		console.error(chalk.red('❌ Error al generar código de vinculación:'), err.message);
		process.exit(1);
	}
}