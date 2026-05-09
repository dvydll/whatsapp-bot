/**
 * Utilidades de descarga de medios - extraído de index.js
 * Funciones para obtener buffers de medios de mensajes
 */

import { downloadContentFromMessage } from 'baileys'

/**
 * Descarga un medio y retorna el buffer
 * @param {string} mediakey - Key del medio de Baileys
 * @param {string} MediaType - Tipo de medio (image, video, audio, sticker)
 * @returns {Promise<Buffer>} Buffer del media
 */
const getFileBuffer = async (mediakey, MediaType) => {
  const stream = await downloadContentFromMessage(mediakey, MediaType)
  let buffer = Buffer.from([])
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
  }
  return buffer
}

export {
  getFileBuffer
}