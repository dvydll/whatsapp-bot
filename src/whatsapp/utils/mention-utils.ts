/**
 * Utilidades de menciones - extraído de index.js
 * Funciones para obtener usuarios mencionados en mensajes
 */

/**
 * Obtiene el usuario mencionado en un mensaje
 * @param info - Objeto del mensaje de Baileys
 * @returns JID del usuario mencionado o null
 */
const obtenerMencionado = (info: {
  extendedTextMessage?: {
    contextInfo?: {
      mentionedJid?: string[];
      participant?: string;
    };
  };
  contextInfo?: {
    mentionedJid?: string[];
    participant?: string;
  };
}): string | null => {
  const context = (info as unknown as {
    extendedTextMessage?: {
      contextInfo?: {
        mentionedJid?: string[];
        participant?: string;
      };
    };
    contextInfo?: {
      mentionedJid?: string[];
      participant?: string;
    };
  })?.extendedTextMessage?.contextInfo
    || (info as unknown as { contextInfo?: { mentionedJid?: string[]; participant?: string } })?.contextInfo
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