/**
 * Tests para el sistema de logging con Pino
 */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { getLogger, resetLogger, logger, LogLevel } from '../../src/infrastructure/logging/logger.js';

// Mock getConfig para testing
vi.mock('../../src/config/env.js', () => ({
  getConfig: () => ({
    LOG_LEVEL: 'debug',
    NODE_ENV: 'development',
    BOT_NAME: 'TestBot',
    OWNER_JID: '123456789@s.whatsapp.net',
    BOT_PREFIX: '.',
    NAUFRA_KEY: 'test-key',
    TIMEZONE: 'America/Lima',
  }),
}));

vi.mock('../../src/config/defaults.js', () => ({
  Defaults: {
    PREFIX: '.',
    TIMEZONE: 'America/Lima',
    COOLDOWN_MS: 3000,
    MAX_COINS: 1000000,
    WELCOME_DELAY_MS: 5000,
    LOG_LEVEL: 'info',
  },
}));

describe('Logger (Pino)', () => {
  beforeEach(() => {
    resetLogger();
  });

  afterEach(() => {
    resetLogger();
  });

  describe('getLogger()', () => {
    it('debe retornar una instancia de logger', () => {
      const log = getLogger();
      expect(log).toBeDefined();
      expect(typeof log.debug).toBe('function');
      expect(typeof log.info).toBe('function');
      expect(typeof log.warn).toBe('function');
      expect(typeof log.error).toBe('function');
    });

    it('debe retornar la misma instancia (singleton)', () => {
      const log1 = getLogger();
      const log2 = getLogger();
      expect(log1).toBe(log2);
    });
  });

  describe('logger proxy', () => {
    it('debe permitir acceso directo a métodos de log', () => {
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
    });
  });

  describe('niveles de log', () => {
    it('debe aceptar mensajes de debug', () => {
      const log = getLogger();
      expect(() => log.debug('test debug message')).not.toThrow();
    });

    it('debe aceptar mensajes de info', () => {
      const log = getLogger();
      expect(() => log.info('test info message')).not.toThrow();
    });

    it('debe aceptar mensajes de warn', () => {
      const log = getLogger();
      expect(() => log.warn('test warn message')).not.toThrow();
    });

    it('debe aceptar mensajes de error', () => {
      const log = getLogger();
      expect(() => log.error('test error message')).not.toThrow();
    });

    it('debe aceptar meta con mensajes', () => {
      const log = getLogger();
      expect(() => log.info('test with meta', { userId: '123', action: 'login' })).not.toThrow();
    });
  });

  describe('resetLogger()', () => {
    it('debe permitir recrear la instancia del logger', () => {
      const log1 = getLogger();
      resetLogger();
      const log2 = getLogger();
      expect(log1).not.toBe(log2);
    });
  });

  describe('LogLevel type', () => {
    it('debe aceptar niveles válidos', () => {
      const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
      expect(validLevels).toHaveLength(4);
    });
  });
});

describe('Logger methods signature', () => {
  const log = getLogger();

  it('debug debe aceptar message y meta opcional', () => {
    // Verify signature
    expect(log.debug.length).toBeLessThanOrEqual(2);
    expect(log.info.length).toBeLessThanOrEqual(2);
    expect(log.warn.length).toBeLessThanOrEqual(2);
    expect(log.error.length).toBeLessThanOrEqual(2);
  });
});