/**
 * Constantes de tipos de mensaje - extraídas de index.js
 * Funciones helper para detectar tipos de mensaje
 */

/**
 * Detecta si el mensaje es de un tipo específico
 * @param {string} type - Tipo de mensaje de Baileys
 * @returns {{ isImage: boolean; isVideo: boolean; isAudio: boolean; isSticker: boolean; isContact: boolean; isLocation: boolean; isProduct: boolean; isMedia: boolean; }} Objeto con todas las constantes is*
 */
function getMessageTypes(type) {
  return {
    isImage: type === "imageMessage",
    isVideo: type === "videoMessage",
    isAudio: type === "audioMessage",
    isSticker: type === "stickerMessage",
    isContact: type === "contactMessage",
    isLocation: type === "locationMessage",
    isProduct: type === "productMessage",
    isMedia: (type === "imageMessage" || type === "videoMessage" || type === "audioMessage")
  }
}

/**
 * Obtiene el nombre del tipo de mensaje
 * @param {string} body - El cuerpo del mensaje
 * @param {Object} types - Objeto de tipos (resultado de getMessageTypes)
 * @returns {string} Nombre del tipo
 */
function getTypeMessage(body, types) {
  let typeMessage = (body || '').substr(0, 50).replace(/\n/g, "")

  if (types.isImage) typeMessage = "Image"
  else if (types.isVideo) typeMessage = "Video"
  else if (types.isAudio) typeMessage = "Audio"
  else if (types.isSticker) typeMessage = "Sticker"
  else if (types.isContact) typeMessage = "Contact"
  else if (types.isLocation) typeMessage = "Location"
  else if (types.isProduct) typeMessage = "Product"

  return typeMessage
}

/**
 * Detecta tipos de mensaje citado (quoted)
 * @param {string} type - Tipo de mensaje
 * @param {string} content - Contenido stringificado del mensaje
 * @returns {Object} Objeto con todas las constantes isQuoted*
 */
function getQuotedTypes(type, content) {
  const isExtendedText = type === "extendedTextMessage"

  return {
    isQuotedMsg: isExtendedText && content.includes("textMessage"),
    isQuotedImage: isExtendedText && content.includes("imageMessage"),
    isQuotedVideo: isExtendedText && content.includes("videoMessage"),
    isQuotedDocument: isExtendedText && content.includes("documentMessage"),
    isQuotedAudio: isExtendedText && content.includes("audioMessage"),
    isQuotedSticker: isExtendedText && content.includes("stickerMessage"),
    isQuotedContact: isExtendedText && content.includes("contactMessage"),
    isQuotedLocation: isExtendedText && content.includes("locationMessage"),
    isQuotedProduct: isExtendedText && content.includes("productMessage")
  }
}

export {
  getMessageTypes, getQuotedTypes, getTypeMessage
}
