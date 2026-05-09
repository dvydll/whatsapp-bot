/**
 * Events - Using any for simplicity
 */

import type { WASocket } from 'baileys';
import { readFileSync } from 'node:fs';
import { createSocket } from './instance.js';
import { handleMessage } from './message-handler.js';
import { createGroupHandler } from './whatsapp/group-handler.js';
import { onConnectionUpdate } from './whatsapp/handlers/connection.js';

interface SockRefs {
  sock: WASocket;
  saveCreds: () => Promise<void>;
}

const loadGroupConfig = () => {
  try { return { welcome: JSON.parse(readFileSync('./settings/Grupo/Json/welcome.json', 'utf-8')) }; }
  catch { return { welcome: [] }; }
};

export function bindEvents(refs: SockRefs): void {
  const { sock, saveCreds } = refs;
  const grpCfg = loadGroupConfig();

  sock.ev.on('connection.update', onConnectionUpdate(async () => {
    console.info('[events] Reconnecting...');
    const newRefs = await createSocket();
    refs.sock = newRefs.sock;
    refs.saveCreds = newRefs.saveCreds;
    bindEvents(refs);
  }));

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('group-participants.update', createGroupHandler(sock, grpCfg));
  sock.ev.on('messages.upsert', handleMessage(sock));

  console.info('[events] Events bound');
}