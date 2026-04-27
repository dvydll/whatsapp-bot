/**
 * Logger basado en Pino con configuración de entorno
 * @module infrastructure/logging/logger
 */

import pino from 'pino';
import pretty from 'pino-pretty';
import { Defaults } from '../../config/defaults.js';
import { getConfig } from '../../config/env.js';

/**
 * Tipo para niveles de log suportados
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Interfaz mínima del logger para el proyecto
 */
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

/**
 * Crea el stream de pretty (desarrollo)
 */
function createPrettyStream() {
  return pretty({
    colorize: true,
    translateTime: 'HH:MM:ss',
    ignore: 'pid,hostname,env',
    singleLine: true,
  });
}

/**
 * Instancia singleton del logger
 * Se crea lazily al primer acceso
 */
let _loggerInstance: Logger | null = null;

/**
 * Obtiene la instancia del logger (singleton)
 * Utiliza pino-pretty en desarrollo, JSON en producción
 */
export function getLogger(): Logger {
  if (_loggerInstance === null) {
    const config = getConfig();
    const logLevel = config.LOG_LEVEL || Defaults.LOG_LEVEL;
    const nodeEnv = config.NODE_ENV || Defaults.NODE_ENV;

    if (nodeEnv === 'development') {
      const prettyStream = createPrettyStream();
      _loggerInstance = pino(prettyStream) as Logger;
    } else {
      _loggerInstance = pino({
        level: logLevel,
        formatters: {
          bindings: (bindings) => ({
            ...bindings,
            env: nodeEnv,
          }),
        },
      }) as Logger;
    }

    const logger = _loggerInstance as pino.Logger;
    logger.info('Logger inicializado');
  }

  return _loggerInstance;
}

/**
 * Proxy que permite acceso directo al logger
 * Inicializa lazily al primer acceso
 */
export const logger: Logger = new Proxy({} as Logger, {
  get(_target, prop) {
    return getLogger()[prop as keyof Logger];
  },
});

/**
 * Resetea la instancia del logger (útil para testing)
 * @internal
 */
export function resetLogger(): void {
  _loggerInstance = null;
}

export { pino };
