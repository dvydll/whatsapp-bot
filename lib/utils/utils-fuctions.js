/**
 * Funciones utilitarias - extraídas de fuction/settings/fuctions.js
 * Solo las funciones que se usan en index.js
 */

import mimetype from 'mime-types'

/**
 * Obtiene la extensión de un mime type
 * @param {string} type - MIME type (ej: 'image/jpeg')
 * @returns {Promise<string>} Extensión del archivo
 */
const getExtension = async (type) => {
  return await mimetype.extension(type)
}

/**
 * Genera un nombre de archivo aleatorio
 * @param {string} ext - Extensión del archivo
 * @returns {string} Nombre aleatorio
 */
const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`
}

export {
  getExtension,
  getRandom
}