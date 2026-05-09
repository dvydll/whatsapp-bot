/**
 * Funciones utilitarias - extraídas de fuction/settings/fuctions.js
 * Solo las funciones que se usan en index.js
 */

import mimetype from 'mime-types'

/**
 * Obtiene la extensión de un mime type
 * @param type - MIME type (ej: 'image/jpeg')
 * @returns Extensión del archivo
 */
async function getExtension(type: string): Promise<string | false> {
  return mimetype.extension(type)
}

/**
 * Genera un nombre de archivo aleatorio
 * @param ext - Extensión del archivo
 * @returns Nombre aleatorio
 */
function getRandom(ext: string): string {
  return `${Math.floor(Math.random() * 10000)}${ext}`
}

export {
  getExtension,
  getRandom
}