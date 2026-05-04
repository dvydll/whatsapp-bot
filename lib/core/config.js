/**
 * Constantes de configuración - extraídas de index.js
 * Sin dependencias del socket
 */

// Cargar configuración desde settings.json
import { default as settings } from '../../settings/settings.json' with { type: "json" };

const { Bot, creador, JpgBot, NAUFRA_KEY, owner } = settings;
// Prefijos de comandos
const prefixo = ['#', '/', '•', '.', '!', '?', '*']

// API URL
const APINAUFRA = 'https://api.naufrabot.com'

// Opciones de conexión
const pairingCode = true

// Mobile mode flag
const useMobile = process.argv.includes("--mobile")

// Configuración del bot
export {
  APINAUFRA, Bot, creador, JpgBot,
  NAUFRA_KEY, owner, pairingCode, prefixo, useMobile
};

