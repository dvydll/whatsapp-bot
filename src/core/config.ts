/**
 * Constantes de configuración - extraídas de index.js
 * Sin dependencias del socket
 */

import fs from 'fs'

// Cargar configuración desde settings/config.json
const settings = JSON.parse(fs.readFileSync('./settings/config.json', 'utf-8')) as {
  Bot: string;
  creador: string;
  JpgBot: string;
  NAUFRA_KEY: string;
  owner: string;
  prefix?: string[];
};

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