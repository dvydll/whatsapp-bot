/**
 * WhatsApp Bot - Entry Point
 * @module index
 * 
 * Enfoque funcional: closures, inmutabilidad, sin estado global mutable
 */

import { config } from './config/index.js';
import { getWhatsAppClient, type WhatsAppClient } from './infrastructure/external/whatsapp-client.js';
import { logger } from './infrastructure/logging/index.js';
import { createMessageHandler, type MessageHandler } from './presentation/handlers/index.js';
import { getPackageVersion } from './shared/utils/esm.js';

/**
 * Versión del bot (inmutable, obtenida dinámicamente)
 */
const BOT_VERSION = getPackageVersion();

/**
 * Banner de inicio (función pura)
 */
const printBanner = (): string => `
 ╔═══════════════════════════════════════════════════════════╗
 ║  ${config.BOT_NAME} v${BOT_VERSION}                    ║
 ║  WhatsApp Bot con arquitectura moderna                 ║
 ╚═══════════════════════════════════════════════════════════╝
`;

/**
 * Mensaje de inicialización (función pura)
 */
const formatInitMessage = (): string => [
  '─'.repeat(53),
  `Inicializando ${config.BOT_NAME} v${BOT_VERSION}...`,
  `Entorno: ${config.NODE_ENV}`,
  `Log Level: ${config.LOG_LEVEL}`,
  `Prefijo de comandos: ${config.BOT_PREFIX}`,
  '─'.repeat(53),
].join('\n');

/**
 * Mensajes de estado de conexión (función pura)
 */
const connectionStateMessages: Record<string, string> = {
  connecting: 'Conectando a WhatsApp...',
  connected: 'Conectado a WhatsApp',
  disconnecting: 'Desconectando de WhatsApp...',
  disconnected: 'Desconectado de WhatsApp',
};

/**
 * Factory: crea las funciones start/stop con estado encapsulado
 * @returns Objeto con funciones start, stop y referencia al estado (solo lectura)
 */
export function createBot(): {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  isRunning: () => boolean;
  getClient: () => WhatsAppClient | null;
} {
  // Estado encapsulado en closure (no accesible desde fuera)
  let waClient: WhatsAppClient | null = null;
  let isRunning = false;

  /**
   * Configura los eventos del cliente WhatsApp
   */
  const setupWAEvents = (mh: MessageHandler): void => {
    // Evento: mensaje entrante
    waClient!.onMessage(async (wamessage) => {
      await mh.handle(wamessage);
    });

    // Evento: cambio de conexión
    waClient!.onConnection((state) => {
      logger.info(connectionStateMessages[state] || `Estado: ${state}`);
    });

    // Evento: error
    waClient!.onError((error) => {
      logger.error(`Error de WhatsApp: ${error.message}`);
    });
  };

  /**
   * Inicia el bot conectándose a WhatsApp
   */
  const start = async (): Promise<void> => {
    if (isRunning) {
      logger.warn('El bot ya está en ejecución');
      return;
    }

    logger.info('Iniciando conexión con WhatsApp...');

    // Obtener instancia del cliente
    waClient = getWhatsAppClient();

    // Crear manejador de mensajes
    const messageHandler = createMessageHandler(waClient);

    // Configurar eventos
    setupWAEvents(messageHandler);

    // Conectar a WhatsApp
    await waClient.connect();

    // Obtener info del bot
    const botInfo = waClient.getMe();
    logger.info(`Bot conectado como: ${botInfo.name} (${botInfo.jid})`);

    isRunning = true;
    logger.info('Bot conectado y en ejecución');
  };

  /**
   * Detiene el bot de manera graceful
   */
  const stop = async (): Promise<void> => {
    if (!isRunning) {
      logger.warn('El bot no está en ejecución');
      return;
    }

    logger.info('Deteniendo bot...');

    if (waClient) {
      await waClient.disconnect();
    }

    isRunning = false;
    logger.info('Bot detenido correctamente');
    logger.info('¡Hasta luego!');
  };

  return {
    start,
    stop,
    isRunning: () => isRunning,
    getClient: () => waClient,
  };
}

/**
 * Configura manejador de señales del sistema
 * @param botInstance - Instancia del bot devuelta por createBot()
 */
export const setupSignalHandlers = (botInstance: ReturnType<typeof createBot>): void => {
  const handleSignal = async (signal: string): Promise<void> => {
    logger.warn(`Señal ${signal} recibida, cerrando...`);
    await botInstance.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGTERM', () => handleSignal('SIGTERM'));
};

/**
 * Inicialización automática cuando se ejecuta directamente
 */
const main = async (): Promise<void> => {
  console.log(printBanner());
  logger.info(formatInitMessage());
  
  const bot = createBot();
  setupSignalHandlers(bot);
  
  await bot.start();
};

// Ejecutar si es el entry point principal
main().catch((error) => {
  logger.error(`Error fatal: ${error}`);
  process.exit(1);
});

// Export factory como default export
export default createBot;