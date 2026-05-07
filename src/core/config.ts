/**
 * Constantes de configuración - extraídas de index.js
 * Sin dependencias del socket
 */

<<<<<<< HEAD:src/core/config.ts
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

=======
// Cargar configuración desde config.json
import settings from '../../settings/config.json' with { type: "json" };

const {
	Bot,
	creador,
	JpgBot,
	NAUFRA_KEY,
	owner,
	prefix,
	APINAUFRA: apiUrl,
} = settings;

>>>>>>> 794c794 (refactor(config): use native JSON import):lib/core/config.js
// Prefijos de comandos
const prefixo = prefix || ['#', '/', '•', '.', '!', '?', '*'];

// API URL
const APINAUFRA = apiUrl || 'https://api.naufrabot.com';

// Opciones de conexión
const pairingCode = true;

// Mobile mode flag
const useMobile = process.argv.includes('--mobile');

// Configuración del bot
export {
<<<<<<< HEAD:src/core/config.ts
  APINAUFRA, Bot, creador, JpgBot,
  NAUFRA_KEY, owner, pairingCode, prefixo, useMobile
=======
	APINAUFRA,
	Bot,
	creador,
	JpgBot,
	NAUFRA_KEY,
	owner,
	pairingCode,
	prefixo,
	useMobile,
>>>>>>> 794c794 (refactor(config): use native JSON import):lib/core/config.js
};