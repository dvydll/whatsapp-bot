/**
 * Funciones utilitarias - extraídas de fuction/settings/fuctions.js
 * Solo las funciones que se usan en index.js
 */

let mimetype
try {
  mimetype = require('mime-types')
} catch (e) {
  // fallback
}

/**
 * Obtiene la extensión de un mime type
 * @param {string} type - MIME type (ej: 'image/jpeg')
 * @returns {Promise<string>} Extensión del archivo
 */
const getExtension = async (type) => {
  if (mimetype) {
    return await mimetype.extension(type)
  }
  // fallback simple
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'audio/mpeg': 'mp3'
  }
  return map[type] || 'bin'
}

/**
 * Genera un nombre de archivo aleatorio
 * @param {string} ext - Extensión del archivo
 * @returns {string} Nombre aleatorio
 */
const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`
}

module.exports = {
  getExtension,
  getRandom
}