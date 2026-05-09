/**
 * Utilidades de menciones - extraído de index.js
 * Funciones para obtener usuarios mencionados en mensajes
 */

/**
 * Obtiene el usuario mencionado en un mensaje
 * @param {Object} info - Objeto del mensaje de Baileys
 * @returns {string|null} JID del usuario mencionado o null
 */
const obtenerMencionado = (info) => {
  const context = info.message?.extendedTextMessage?.contextInfo
    || info.message?.contextInfo
    || null;

  if (context?.mentionedJid && context.mentionedJid.length > 0) {
    return context.mentionedJid[0];
  }

  if (context?.participant) {
    return context.participant;
  }

  return null;
};

export {
  obtenerMencionado
}