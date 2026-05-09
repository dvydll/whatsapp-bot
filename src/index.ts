/**
 * Entry Point
 */

import { requestPairingCode } from './connect.js';
import { bindEvents } from './events.js';
import { createSocket } from './instance.js';

console.info('🔥 DayaBot Starting...');

async function main() {
  const { sock, saveCreds } = await createSocket();
  await requestPairingCode(sock);

  bindEvents({ sock, saveCreds });
  console.info('[main] Bot started');
}

main().catch(console.error);