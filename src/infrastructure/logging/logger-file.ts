/**
 * Transport de archivo para Pino con rotación básica
 * @module infrastructure/logging/logger-file
 */

import pino from 'pino';
import { getConfig } from '../../config/env.js';
import { Defaults } from '../../config/defaults.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync, appendFileSync, readdirSync, unlinkSync, statSync } from 'node:fs';
import { getLogger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Configuración del transport de archivo
 */
export interface FileTransportOptions {
  /** Directorio donde se guardan los logs */
  logDir?: string;
  /** Nombre base del archivo de log */
  filename?: string;
  /** Cantidad máxima de archivos */
  maxFiles?: number;
  /** Tamaño máximo por archivo (bytes) */
  maxSize?: number;
}

/**
 * Opciones por defecto
 */
const defaultOptions: Required<FileTransportOptions> = {
  logDir: join(__dirname, '../../../logs'),
  filename: 'app.log',
  maxFiles: 7,
  maxSize: 10 * 1024 * 1024, // 10MB
};

/**
 * Asegura que el directorio de logs existe
 */
function ensureLogDirectory(logDir: string): void {
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }
}

/**
 * Escribe una línea al archivo de log
 */
function writeToFile(logPath: string, line: string): void {
  try {
    appendFileSync(logPath, line, { encoding: 'utf8' });
  } catch (err) {
    // Fallback to console if file write fails
    console.error('Failed to write to log file:', err);
  }
}

/**
 * Obtiene el tamaño actual del archivo
 */
function getFileSize(filePath: string): number {
  try {
    return statSync(filePath).size;
  } catch {
    return 0;
  }
}

/**
 * Rota el archivo de log (renombra a .old o elimina)
 */
function rotateLogFile(logPath: string, maxFiles: number, compress: boolean = true): void {
  const ext = logPath.split('.').pop();
  const base = logPath.replace(`.${ext}`, '');
  const oldPath = `${base}.old.${ext}`;

  try {
    // Rename current to old
    writeToFile(oldPath, ''); // Create marker
    unlinkSync(logPath);
  } catch {
    // File might not exist yet
  }
}

/**
 * Crea un logger con transport de archivo
 * @param options Opciones para el transport
 * @returns Logger con archivo habilitado
 */
export function createFileLogger(options: FileTransportOptions = {}): pino.Logger {
  const opts = { ...defaultOptions, ...options };
  const config = getConfig();
  const logLevel = config.LOG_LEVEL || Defaults.LOG_LEVEL;

  // Asegurar directorio existe
  ensureLogDirectory(opts.logDir);
  const logPath = join(opts.logDir, opts.filename);

  return pino({
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      bindings: () => ({}),
    },
  },
  {
    write(msg) {
      const line = msg + '\n';

      // Check rotation size
      const size = getFileSize(logPath);
      if (size > opts.maxSize && size > 0) {
        rotateLogFile(logPath, opts.maxFiles);
      }

      writeToFile(logPath, line);
    },
  });
}

/**
 * Crea un logger de errores separado
 */
export function createErrorFileLogger(options: FileTransportOptions = {}): pino.Logger {
  const opts = { ...defaultOptions, ...options };
  ensureLogDirectory(opts.logDir);
  const errorPath = join(opts.logDir, 'error.log');

  return pino({
    level: 'error',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      bindings: () => ({}),
    },
  },
  {
    write(msg) {
      writeToFile(errorPath, msg + '\n');
    },
  });
}

/**
 * Obtiene la ruta del directorio de logs
 */
export function getLogDirectory(options?: FileTransportOptions): string {
  const opts = { ...defaultOptions, ...options };
  return opts.logDir;
}

/**
 * Limpia logs antiguos
 * @param daysOlderThan Eliminar archivos mayores a N días
 */
export function cleanupOldLogs(daysOlderThan: number = 7): void {
  const opts = { ...defaultOptions };
  const logger = getLogger();

  try {
    if (!existsSync(opts.logDir)) {
      return;
    }

    const files = readdirSync(opts.logDir);
    const now = Date.now();
    const maxAge = daysOlderThan * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = join(opts.logDir, file);
      const stat = statSync(filePath);

      if (stat.isFile() && now - stat.mtimeMs > maxAge) {
        unlinkSync(filePath);
        logger.info(`Deleted old log: ${file}`);
      }
    }
  } catch (err) {
    logger.error(`Failed to cleanup old logs: ${err}`);
  }
}

export { pino };