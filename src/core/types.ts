/**
 * Tipos de mensaje - extraídos de index.js
 * Funciones helper para detectar tipos de mensaje
 */

export interface MessageTypes {
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isSticker: boolean;
  isContact: boolean;
  isLocation: boolean;
  isProduct: boolean;
  isMedia: boolean;
}

export interface QuotedTypes {
  isQuotedMsg: boolean;
  isQuotedImage: boolean;
  isQuotedVideo: boolean;
  isQuotedDocument: boolean;
  isQuotedAudio: boolean;
  isQuotedSticker: boolean;
  isQuotedContact: boolean;
  isQuotedLocation: boolean;
  isQuotedProduct: boolean;
}

/**
 * Detecta si el mensaje es de un tipo específico
 * @param type - Tipo de mensaje de Baileys
 * @returns Objeto con todas las constantes is*
 */
export function getMessageTypes(type: string): MessageTypes {
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
 * @param body - El cuerpo del mensaje
 * @param types - Objeto de tipos (resultado de getMessageTypes)
 * @returns Nombre del tipo
 */
export function getTypeMessage(body: string, types: MessageTypes): string {
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
 * @param type - Tipo de mensaje
 * @param content - Contenido stringificado del mensaje
 * @returns Objeto con todas las constantes isQuoted*
 */
export function getQuotedTypes(type: string, content: string): QuotedTypes {
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