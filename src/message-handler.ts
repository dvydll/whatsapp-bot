/**
 * Message Handler - Simplified TS
 */

import fs from 'node:fs';
import { executeCommand } from './commands/index.js';
import { getQuotedTypes } from './core/types.js';
import economy from './systems/economy.js';
import { getRespuestas } from './utils/responses.js';
import { expiredClaim } from './systems/games/claim.js';
import {
  expiredAttp, expiredDayli, expiredEmoji,
  expiredEve, expiredMinar, expiredPescar, expiredRuleta,
} from './systems/games/mining.js';
import type { WASocket } from 'baileys';

interface MsgContext {
  info: any; from: string; type: string; body: string;
  comando: string; args: string[]; q: string;
  sender: string; pushname: string; isOwner: boolean;
  isReg: boolean; isGroup: boolean;
  groupMembers: any[]; groupAdmins: any[];
  isGroupAdmins: boolean; isBotGroupAdmins: boolean;
  sendMention: (txt: string, members: any[]) => void;
  BotNumber: string; welcome: string[]; bngp: string[];
  antilink: string[]; Antipv: string[];
  modoAdminList: string[]; botActivo: boolean;
  isWelcome: boolean; isBanGp: boolean;
  isAntiLink: boolean; isAntipv: boolean;
  isModoAdmin: boolean; coins: number; roleData: any[];
  isQuotedVideo: boolean; isQuotedSticker: boolean;
  respuesta: any; sendText: (txt: string, opt?: any) => void;
  doSleep: (ms: number) => Promise<void>; sock: WASocket;
}

const removeAccents = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

let _cmdPrefix: string[] | null = null;
const getCmdPrefix = (): string[] => { _cmdPrefix ??= ['.']; return _cmdPrefix; };

const extractBody = (info: any, type: string): string => {
  const map: Record<string, string> = {
    conversation: info.message?.conversation,
    imageMessage: info.message?.imageMessage?.caption,
    videoMessage: info.message?.videoMessage?.caption,
    extendedTextMessage: info.message?.extendedTextMessage?.text,
    buttonsResponseMessage: info.message?.buttonsResponseMessage?.selectedButtonId,
    listResponseMessage: info.message?.listResponseMessage?.singleSelectReply?.selectedRowId,
    templateButtonReplyMessage: info.message?.templateButtonReplyMessage?.selectedId,
  };
  return map[type] || '';
};

export function createMessageContext(msgInfo: any, sock: WASocket): MsgContext | null {
  const info = msgInfo.messages?.[0];
  if (!info?.message) return null;
  if (info.key?.remoteJid === 'status@broadcast') return null;

  const keys = Object.keys(info.message);
  const type = keys[0] === 'senderKeyDistributionMessage'
    ? keys[1] === 'messageContextInfo' ? keys[2] : keys[1] : keys[0];

  const from = info.key?.remoteJid || '';
  const body = extractBody(info, type);
  const isGroup = from.endsWith('@g.us');
  const sender = isGroup ? (info.key?.participant || from) : from;
  const pushname = info.pushName || '';

  let welcome: string[] = [], bngp: string[] = [], antilink: string[] = [],
      Antipv: string[] = [], modoAdminList: string[] = [], 
      botActivo = true, roleData: any[] = [];
  try {
    welcome = JSON.parse(fs.readFileSync('./settings/Grupo/Json/welcome.json', 'utf-8'));
    bngp = JSON.parse(fs.readFileSync('./settings/Grupo/Json/grupo.json', 'utf-8'));
    antilink = JSON.parse(fs.readFileSync('./settings/Grupo/Json/antilink.json', 'utf-8'));
    Antipv = JSON.parse(fs.readFileSync('./settings/Grupo/Json/chat.json', 'utf-8'));
    modoAdminList = JSON.parse(fs.readFileSync('./settings/Grupo/Json/modo_admin.json', 'utf-8'));
    botActivo = JSON.parse(fs.readFileSync('./settings/estadoBot.json', 'utf-8')).activo;
    roleData = JSON.parse(fs.readFileSync('./settings/rangos.json', 'utf-8'));
  } catch { /* use defaults */ }

  const isReg = economy.checkOfReg(sender);
  const coins = economy.MoneyOfSender(sender);
  const qTypes = getQuotedTypes(type, JSON.stringify(info.message));
  const BotNumber = `${sock.user?.id?.split(':')[0]}@s.whatsapp.net`;

  const lower = body.toLowerCase();
  const prefixes = getCmdPrefix();
  const hasPref = prefixes.some((p) => lower.startsWith(p.toLowerCase()));
  
  let cmd = '', args: string[] = [];
  if (hasPref) {
    const matched = prefixes.find((p) => lower.startsWith(p.toLowerCase()));
    const part = lower.slice((matched || '').length).trim();
    const pieces = part.split(/\s+/);
    cmd = removeAccents(pieces[0] || '');
    args = pieces.slice(1);
  }

  const sendText = (txt: string, opt = {}) => sock.sendMessage(from, { text: txt }, { quoted: info, ...opt });
  const sendMention = (txt: string, members: any[]) => sock.sendMessage(from, { text: txt.trim(), mentions: members });
  const doSleep = (ms: number): Promise<void> => 
    new Promise<void>((r) => setTimeout(r, ms));

  return {
    info, from, type, body, comando: cmd, args, q: args.join(' '),
    sender, pushname, isOwner: false, isReg, isGroup,
    groupMembers: [], groupAdmins: [], isGroupAdmins: false, isBotGroupAdmins: false,
    sendMention, BotNumber, welcome, bngp, antilink, Antipv, modoAdminList, botActivo,
    isWelcome: isGroup && welcome.includes(from),
    isBanGp: isGroup && bngp.includes(from),
    isAntiLink: isGroup && antilink.includes(from),
    isAntipv: Antipv.includes('activo'),
    isModoAdmin: isGroup && modoAdminList.includes(from),
    coins, roleData,
    isQuotedVideo: qTypes.isQuotedVideo,
    isQuotedSticker: qTypes.isQuotedSticker,
    respuesta: getRespuestas(sender), sendText, doSleep, sock
  };
}

export function handleMessage(sock: WASocket) {
  return async (ev: any) => {
    try {
      expiredClaim(); expiredMinar(); expiredAttp(); expiredEmoji();
      expiredEve(); expiredDayli(); expiredPescar(); expiredRuleta();

      const ctx = createMessageContext(ev, sock);
      if (!ctx) return;
      const { isBanGp, isAntipv, isOwner, isGroup, isModoAdmin, isGroupAdmins, botActivo, comando } = ctx;

      if (isBanGp) return;
      if (isAntipv && !isGroup && !isOwner) { await sock.updateBlockStatus(ctx.sender, 'block'); return; }
      if (isModoAdmin && !isGroupAdmins && !isOwner) return;
      if (!botActivo && !isOwner) return;

      console.info(`[${isGroup ? 'GRUPO' : 'PV'}] ${ctx.pushname} (${ctx.sender})${comando ? ` cmd: ${comando}` : ''}`);

      if (comando) executeCommand(comando, ctx);
    } catch (e) { console.error('ERROR:', e); }
  };
}

export default { handleMessage, createMessageContext };