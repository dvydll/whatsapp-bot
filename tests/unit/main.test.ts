/**
 * Tests para el módulo main
 * @module tests/unit/main.test
 */

import { describe, expect, it, vi } from 'vitest';

// Mock getConfig antes de importar el módulo main
vi.mock('../../src/config/env.js', () => ({
  getConfig: () => ({
    BOT_NAME: 'TestBot',
    OWNER_JID: '123456789@s.whatsapp.net',
    BOT_PREFIX: '.',
    NAUFRA_KEY: 'test-key',
    TIMEZONE: 'America/Lima',
    LOG_LEVEL: 'info',
    NODE_ENV: 'development',
  }),
  config: {
    BOT_NAME: 'TestBot',
    OWNER_JID: '123456789@s.whatsapp.net',
    BOT_PREFIX: '.',
    NAUFRA_KEY: 'test-key',
    TIMEZONE: 'America/Lima',
    LOG_LEVEL: 'info',
    NODE_ENV: 'development',
  },
}));

vi.mock('../../src/config/defaults.js', () => ({
  Defaults: {
    PREFIX: '.',
    TIMEZONE: 'America/Lima',
    COOLDOWN_MS: 3000,
    MAX_COINS: 1000000,
    WELCOME_DELAY_MS: 5000,
    LOG_LEVEL: 'info',
    NODE_ENV: 'development',
  },
}));

vi.mock('../../src/infrastructure/logging/logger.js', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  getLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
  resetLogger: vi.fn(),
}));

// Mock WhatsApp client
vi.mock('../../src/infrastructure/external/whatsapp-client.js', () => ({
  getWhatsAppClient: () => ({
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    sendMessage: vi.fn().mockResolvedValue({ key: { id: 'test' } }),
    getMe: () => ({ id: '123456789@s.whatsapp.net', name: 'TestBot' }),
    onMessage: vi.fn(),
    onConnection: vi.fn(),
    onError: vi.fn(),
  }),
}));

describe('main', () => {
  describe('exports', () => {
    it('debe exportar la función start', async () => {
      const { start } = await import('../../src/index.js');
      expect(start).toBeDefined();
      expect(typeof start).toBe('function');
    });

    it('debe exportar la función stop', async () => {
      const { stop } = await import('../../src/index.js');
      expect(stop).toBeDefined();
      expect(typeof stop).toBe('function');
    });
  });

  describe('start', () => {
    it('debe ser una función async', async () => {
      const { start } = await import('../../src/index.js');
      const result = start();
      expect(result).toBeInstanceOf(Promise);
      await result;
    });
  });

  describe('stop', () => {
    it('debe ser una función async', async () => {
      const { stop } = await import('../../src/index.js');
      const result = stop();
      expect(result).toBeInstanceOf(Promise);
      await result;
    });
  });
});