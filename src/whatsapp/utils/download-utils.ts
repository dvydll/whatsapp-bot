/**
 * Utilidades de descarga de medios - extraído de index.js
 * Funciones para obtener buffers de medios de mensajes
 */

import { downloadContentFromMessage, type WASocket } from 'baileys'

/**
 * Descarga un medio y retorna el buffer
 * @param mediakey - Key del medio de Baileys
 * @param MediaType - Tipo de medio (image, video, audio, sticker)
 * @returns Buffer del media
 */
const getFileBuffer = async (
  mediakey:WASocket['ev'],
  MediaType: 'image' | 'video' | 'audio' | 'sticker'
): Promise<Buffer> => {
  const stream = await downloadContentFromMessage(
    mediakey as unknown as Parameters<typeof downloadContentFromMessage>[0],
    MediaType
  )
  let buffer = Buffer.from([])
  for await (const chunk of stream as unknown as AsyncIterable<Buffer>) {
    buffer = Buffer.concat([buffer, chunk])
  }
  return buffer
}

export {
  getFileBuffer
}