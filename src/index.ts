import { config } from './config/index.js';
import { getWhatsAppClient, type WhatsAppClient } from './infrastructure/external/whatsapp-client.js';
import { logger } from './infrastructure/logging/index.js';
import { getPackageVersion } from './shared/utils/esm.js';

/**
 * Versión del bot (obtenida dinámicamente desde package.json)
 */
const BOT_VERSION = getPackageVersion();

/**
 * Instancia del cliente WhatsApp
 */
let waClient: WhatsAppClient | null = null;

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
║  ${config.BOT_NAME} v${BOT_VERSION}                           ║
║  WhatsApp Bot con arquitectura moderna                 ║
╚═══════════════════════════════════════════════════════════╝
  `;
  console.log(banner);
}

/**
 * Mensaje de inicialización
 */
function printInitialization(): void {
  logger.info('─'.repeat(53));
  logger.info(`Inicializando ${config.BOT_NAME} v${BOT_VERSION}...`);
  logger.info(`Entorno: ${config.NODE_ENV}`);
  logger.info(`Log Level: ${config.LOG_LEVEL}`);
  logger.info(`Prefijo de comandos: ${config.BOT_PREFIX}`);
  logger.info('─'.repeat(53));
}

/**
 * Configura los eventos del cliente WhatsApp
 */
function setupWAEvents(): void {
  if (!waClient) return;

  // Evento: mensaje entrante
  waClient.onMessage(async (message) => {
    const jid = message.key.remoteJid;
    const pushName = message.pushName || 'Desconocido';

    logger.debug(`Mensaje de ${pushName} (${jid})`);

    // TODO: Implementar handlers de comandos aquí
    // Por ahora solo logueamos el mensaje
  });

  // Evento: cambio de conexión
  waClient.onConnection((state) => {
    const stateMessages: Record<string, string> = {
      connecting: 'Conectando a WhatsApp...',
      connected: 'Conectado a WhatsApp',
      disconnecting: 'Desconectando de WhatsApp...',
      disconnected: 'Desconectado de WhatsApp',
    };

    logger.info(stateMessages[state] || `Estado: ${state}`);
  });

  // Evento: error
  waClient.onError((error) => {
    logger.error(`Error de WhatsApp: ${error.message}`);
  });
}

/**
 * Inicia el bot conectándose a WhatsApp
 */
async function start(): Promise<void> {
  if (isRunning) {
    logger.warn('El bot ya está en ejecución');
    return;
  }

  logger.info('Iniciando conexión con WhatsApp...');

  try {
    // Obtener instancia del cliente
    waClient = getWhatsAppClient();

    // Configurar eventos
    setupWAEvents();

    // Conectar a WhatsApp
    await waClient.connect();

    // Obtener info del bot
    const botInfo = waClient.getMe();
    logger.info(`Bot conectado como: ${botInfo.name} (${botInfo.jid})`);

    isRunning = true;
    logger.info('Bot conectado y en ejecución');
  } catch (error) {
    const err = error as Error;
    logger.error(`Error al iniciar bot: ${err.message}`);
    throw error;
  }
}

/**
 * Detiene el bot de manera graceful
 * @description Cierra conexiones y limpa recursos
 */
async function stop(): Promise<void> {
  if (!isRunning) {
    logger.warn('El bot no está en ejecución');
    return;
  }

  logger.info('Deteniendo bot...');

  try {
    if (waClient) {
      await waClient.disconnect();
      waClient = null;
    }

    isRunning = false;
    logger.info('Bot detenido correctamente');
    logger.info('¡Hasta luego!');
  } catch (error) {
    const err = error as Error;
    logger.error(`Error al detener bot: ${err.message}`);
    throw error;
  }
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
