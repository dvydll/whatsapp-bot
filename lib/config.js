/**
 * Constantes de configuración - extraídas de index.js
 * Sin dependencias del socket
 */

// Cargar configuración desde settings.json
const { creador, owner, Bot, JpgBot, NAUFRA_KEY } = require('../settings/settings.json')

// Prefijos de comandos
const prefixo = ['#', '/', '•', '.', '!', '?', '*']

// API URL
const APINAUFRA = 'https://api.naufrabot.com'

// Opciones de conexión
const pairingCode = true

// Mobile mode flag
const useMobile = process.argv.includes("--mobile")

module.exports = {
  // Configuración del bot
  creador,
  owner,
  Bot,
  JpgBot,
  NAUFRA_KEY,

  // Comandos
  prefixo,
  APINAUFRA,

  // Opciones
  pairingCode,
  useMobile
}