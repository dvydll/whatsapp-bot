/**
 * Connect - Solicita código de vinculación
 */

import chalk from 'chalk';
import readline from 'node:readline';
import type { WASocket } from 'baileys';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text: string): Promise<string> => 
  new Promise((resolve) => rl.question(text, resolve));

/**
 * Solicita código de vinculación para el bot
 * @param sock - Socket de Baileys
 */
export async function requestPairingCode(sock: WASocket): Promise<void> {
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
    console.error(chalk.red('❌ Error al generar código de vinculación:'), (err as Error).message);
    process.exit(1);
  }
}