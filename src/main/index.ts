/**
 * Main entry point del WhatsApp Bot
 * @module main
 */

import { logger } from '../infrastructure/logging/index.js';
import { config } from '../config/index.js';

/**
 * Nombre del bot
 */
const BOT_NAME = 'whatsappbot';

/**
 * Versión del bot
 */
const BOT_VERSION = '1.0.0';

/**
 * Bandera para controlar el estado del bot
 */
let isRunning = false;

/**
 * Mensaje de banner inicial
 */
function printBanner(): void {
  const banner = `
╔═══════════════════════════════════════════════════════════╗
║  ${BOT_NAME} v${BOT_VERSION}                                        ║
║  WhatsApp Bot con arquitectura moderna                   ║
╚═══════════════════════════════════════════════════════════╝
  `;
  console.log(banner);
}

/**
 * Mensaje de inicialización
 */
function printInitialization(): void {
  logger.info('─'.repeat(53));
  logger.info(`Inicializando ${BOT_NAME} v${BOT_VERSION}...`);
  logger.info(`Entorno: ${(config as any).NODE_ENV}`);
  logger.info(`Log Level: ${(config as any).LOG_LEVEL}`);
  logger.info(`Prefijo de comandos: ${(config as any).BOT_PREFIX}`);
  logger.info('─'.repeat(53));
}

/**
 * Inicia el bot conectándose a WhatsApp
 * @description Placeholder - la conexión real con Baileys se implementará después
 */
async function start(): Promise<void> {
  if (isRunning) {
    logger.warn('El bot ya está en ejecución');
    return;
  }

  logger.info('Iniciando conexión con WhatsApp...');
  
  // Placeholder: aquí se implementará la conexión real con Baileys
  console.log('[WAIT] Conectando a WhatsApp (placeholder)...');
  
  isRunning = true;
  logger.info('Bot conectado y en ejecución');
}

/**
 * Detiene el bot de manera graceful
 * @description Cierra conexiones y limpia recursos
 */
async function stop(): Promise<void> {
  if (!isRunning) {
    logger.warn('El bot no está en ejecución');
    return;
  }

  logger.info('Deteniendo bot...');
  
  // Limpieza de recursos
  isRunning = false;
  
  logger.info('Bot detenido correctamente');
  logger.info('¡Hasta luego!');
}

/**
 * Manejador de señales del sistema
 * @description Maneja SIGINT (Ctrl+C) y SIGTERM (kill)
 */
function setupSignalHandlers(): void {
  const handleSignal = async (signal: string): Promise<void> => {
    logger.warn(`Señal ${signal} recibida, cerrando...`);
    await stop();
    process.exit(0);
  };

  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGTERM', () => handleSignal('SIGTERM'));
}

/**
 * Inicialización automática cuando se ejecuta directamente
 */
async function main(): Promise<void> {
  printBanner();
  printInitialization();
  setupSignalHandlers();
  await start();
}

// Ejecutar si es el entry point principal
main().catch((error) => {
  logger.error(`Error fatal: ${error}`);
  process.exit(1);
});

export { start, stop };