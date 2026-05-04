/**
 * Funciones helper utilitarias - extraídas de index.js
 * Sin dependencias del socket
 */

import fs from 'fs'

/**
 * Selecciona un elemento aleatorio de un array
 * @param {Array} list - Array de elementos
 * @returns {*} Elemento aleatorio
 */
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * Elimina un archivo silenciosamente
 * @param {string} file - Ruta del archivo a eliminar
 */
function DLT_FL(file) {
  try {
    fs.unlinkSync(file)
  } catch (error) {
    // Silencioso
  }
}

/**
 * Función sleep
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que resuelve después del delay
 */
const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Valida si un string es una URL
 * @param {string} url - String a validar
 * @returns {boolean} true si es una URL válida
 */
const isUrl = (url) => {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

/**
 * Guarda el estado del bot (activo/inactivo)
 * @param {boolean} estado - Estado del bot
 */
function guardarEstadoBot(estado) {
  const estadoPath = './settings/estadoBot.json'
  fs.writeFileSync(estadoPath, JSON.stringify({ activo: estado }, null, 2))
}

/**
 * Obtiene el estado del bot
 * @returns {boolean} true si está activo
 */
function getEstadoBot() {
  const estadoPath = './settings/estadoBot.json'
  if (!fs.existsSync(estadoPath)) {
    fs.writeFileSync(estadoPath, JSON.stringify({ activo: true }, null, 2))
    return true
  }
  return JSON.parse(fs.readFileSync(estadoPath)).activo
}

/**
 * Genera un código aleatorio de 6 dígitos
 * @returns {string} Código de 6 caracteres
 */
function generarCodigo() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    const indice = Math.floor(Math.random() * caracteres.length)
    codigo += caracteres.charAt(indice)
  }
  return codigo
}

/**
 * Carga un JSON con manejo de errores
 * @param {string} filePath - Ruta del archivo JSON
 * @returns {*} Contenido parseado o array vacío
 */
function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch (e) {
    return []
  }
}

export {
  pickRandom,
  DLT_FL,
  sleep,
  isUrl,
  guardarEstadoBot,
  getEstadoBot,
  generarCodigo,
  loadJson
}