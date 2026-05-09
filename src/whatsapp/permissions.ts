/**
 * Permisos y validaciones - extraído de index.js
 * Funciones para verificar permisos de usuario y grupo
 */

import type { WASocket } from 'baileys';

/**
 * Verifica si el bot es admin del grupo de forma flexible (soporta LID y JID)
 * @param sock - Socket de Baileys
 * @param listaDeAdmins - Array de JIDs de administradores
 * @returns true si el bot es admin
 */
const esAdminFlexible = (sock: WASocket, listaDeAdmins: string[] = []): boolean => {
  if (!sock?.authState?.creds?.me) return false

  const botId = sock.authState.creds.me.id     // ej: 51916525000:26@lid
  const botLid = sock.authState.creds.me.lid  // ej: 51916525000@lid

  const clean = (jid: string | undefined): string => (jid ?? '').split(':')[0]    // elimina el ":26" si existe

  return listaDeAdmins.some(adminJid => {
    const adminBase = clean(adminJid)
    return (
      adminJid === botId ||
      adminJid === botLid ||
      adminJid === botId?.replace(/:\d+/, '') ||   // compara sin ":xx"
      adminJid === botLid?.replace(/:\d+/, '') ||
      adminBase === clean(botId) ||
      adminBase === clean(botLid)
    )
  })
}

export interface PermissionsContext {
  sender: string;
  from: string;
  isGroup: boolean;
  groupAdmins: Array<{ id: string }>;
  isOwner?: boolean;
}

export interface PermissionsConfig {
  welkom?: string[];
  bngp?: string[];
  antilink?: string[];
  Antipv?: string[];
  modoAdminList?: string[];
}

export interface PermissionsResult {
  isGroupAdmins: boolean;
  isBotGroupAdmins: boolean;
  iswelkom: boolean;
  isBanGp: boolean;
  isAntipv: boolean;
  isAntiLink: boolean;
  isModoAdmin: boolean;
  isReg: boolean;
  isOwner: boolean;
  esAdminFlexible: typeof esAdminFlexible;
}

/**
 * Factory de permisos - crea las constantes de permisos basadas en el contexto
 * @param params - Dependencias necesarias
 * @returns Objeto con todas las constantes de permisos
 */
const createPermissions = ({
  sock,
  economy,
  config,
  context,
}: {
  sock: WASocket;
  economy?: {
    checkOfReg: (sender: string) => boolean;
  };
  config?: PermissionsConfig;
  context: PermissionsContext;
}): PermissionsResult => {
  const { sender, from, isGroup, groupAdmins } = context
  const { welkom = [], bngp = [], antilink = [], Antipv = [], modoAdminList = [] } = config || {}

  // Validaciones de grupo
  const isGroupAdmins = isGroup ? groupAdmins?.some(admin => admin.id?.includes(sender)) : false
  const isBotGroupAdmins = esAdminFlexible(sock, groupAdmins?.map(p => p.id) || [])

  // Validaciones de configuración
  const iswelkom = isGroup ? welkom.includes(from) : false
  const isBanGp = isGroup ? bngp.includes(from) : false
  const isAntipv = Antipv.includes('activo')
  const isAntiLink = isGroup ? antilink.includes(from) : false
  const isModoAdmin = isGroup ? modoAdminList.includes(from) : false

  // Validaciones de usuario
  const isReg = economy?.checkOfReg(sender) || false

  // owner se verifica en el contexto
  const isOwner = context.isOwner || false

  return {
    isGroupAdmins,
    isBotGroupAdmins,
    iswelkom,
    isBanGp,
    isAntipv,
    isAntiLink,
    isModoAdmin,
    isReg,
    isOwner,
    esAdminFlexible  // Exportamos la función también
  }
}

export {
  createPermissions,
  esAdminFlexible
}