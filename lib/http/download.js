/**
 * Funciones de descarga HTTP - extraídas de fuction/download/gets.js
 */

import axios from 'axios'

/**
 * Descarga un archivo como buffer
 * @param {string} url - URL del archivo
 * @param {object} opcoes - Opciones adicionales
 * @returns {Promise<Buffer>} Buffer del archivo
 */
const getBuffer = async (url, opcoes) => {
  try {
    opcoes = opcoes || {}
    const post = await axios({
      method: "get",
      url,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...opcoes,
      responseType: 'arraybuffer'
    })
    return post.data
  } catch (erro) {
    console.log(`Erro identificado: ${erro}`)
  }
}

/**
 * Descarga un archivo como buffer (alternativo)
 * @param {string} url - URL del archivo
 * @param {object} options - Opciones adicionales
 * @returns {Promise<Buffer>} Buffer del archivo
 */
const fetchBuffer = async (url, options) => {
  try {
    options = options || {}
    const res = await axios({
      method: "GET",
      url,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    return res.data
  } catch (err) {
    return err
  }
}

/**
 * Descarga JSON desde una URL
 * @param {string} url - URL del JSON
 * @param {object} options - Opciones adicionales
 * @returns {Promise<object>} Objeto JSON
 */
const fetchJson = async (url, options) => {
  try {
    options = options || {}
    const res = await axios({
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
      },
      ...options
    })
    return res.data
  } catch (err) {
    return err
  }
}

export { fetchJson, getBuffer, fetchBuffer }