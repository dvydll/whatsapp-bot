/**
 * Instance - Crea el socket de Baileys
 */

import {
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  default as makeWASocket,
  useMultiFileAuthState,
  type WASocket,
} from 'baileys';
import pino from 'pino';
import NodeCache from 'node-cache';

export interface SocketResult {
  sock: WASocket;
  saveCreds: () => Promise<void>;
}

/**
 * Crea una nueva instancia del socket
 */
export async function createSocket(): Promise<SocketResult> {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache: new NodeCache(),
    syncFullHistory: false,
  });

  return { sock, saveCreds };
}