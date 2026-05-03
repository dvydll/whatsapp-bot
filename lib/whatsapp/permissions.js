/**
 * Permisos y validaciones - extraído de index.js
 * Funciones para verificar permisos de usuario y grupo
 */

/**
 * Verifica si el bot es admin del grupo de forma flexible (soporta LID y JID)
 * @param {Object} sock - Socket de Baileys
 * @param {Array} listaDeAdmins - Array de JIDs de administradores
 * @returns {boolean} true si el bot es admin
 */
const esAdminFlexible = (sock, listaDeAdmins = []) => {
  if (!sock?.authState?.creds?.me) return false

  const botId = sock.authState.creds.me.id     // ej: 51916525000:26@lid
  const botLid = sock.authState.creds.me.lid  // ej: 51916525000@lid

  const clean = (jid) => jid?.split(':')[0]    // elimina el ":26" si existe

  return listaDeAdmins.some(adminJid => {
    const adminBase = clean(adminJid)
    return (
      adminJid === botId ||
      adminJid === botLid ||
      adminJid === botId.replace(/:\d+/, '') ||   // compara sin ":xx"
      adminJid === botLid.replace(/:\d+/, '') ||
      adminBase === clean(botId) ||
      adminBase === clean(botLid)
    )
  })
}

/**
 * Factory de permisos - crea las constantes de permisos basadas en el contexto
 * @param {Object} params - Dependencias necesarias
 * @param {Object} params.sock - Socket de Baileys
 * @param {Object} params.economy - Módulo de economía
 * @param {Object} params.config - Configuración del grupo (welkom, bngp, antilink, etc.)
 * @param {Object} params.context - Contexto del mensaje (sender, from, isGroup, groupAdmins)
 * @returns {Object} Objeto con todas las constantes de permisos
 */
const createPermissions = ({ sock, economy, config, context }) => {
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

module.exports = {
  esAdminFlexible,
  createPermissions
}