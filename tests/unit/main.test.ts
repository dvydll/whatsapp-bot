/**
 * Tests para el módulo index (enfoque funcional)
 * @module tests/unit/main.test
 */

import { describe, expect, it, vi } from 'vitest';

// Mock getConfig
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

// Mock MessageHandler
vi.mock('../../src/presentation/handlers/index.js', () => ({
  createMessageHandler: vi.fn(() => ({
    handle: vi.fn().mockResolvedValue(undefined),
    registerCommand: vi.fn(),
  })),
}));

describe('index (functional)', () => {
  describe('createBot factory', () => {
    it('debe exportar createBot como función', async () => {
      const { createBot } = await import('../../src/index.js');
      expect(createBot).toBeDefined();
      expect(typeof createBot).toBe('function');
    });

    it('debe crear una instancia con start y stop', async () => {
      const { createBot } = await import('../../src/index.js');
      const bot = createBot();
      
      expect(bot.start).toBeDefined();
      expect(bot.stop).toBeDefined();
      expect(typeof bot.start).toBe('function');
      expect(typeof bot.stop).toBe('function');
      expect(bot.isRunning).toBeDefined();
      expect(bot.getClient).toBeDefined();
    });

    it('debe crear múltiples instancias independientes', async () => {
      const { createBot } = await import('../../src/index.js');
      const bot1 = createBot();
      const bot2 = createBot();
      
      // Cada instancia tiene su propio estado
      expect(bot1).not.toBe(bot2);
    });
  });

  describe('start/stop', () => {
    it('start debe ser una función async', async () => {
      const { createBot } = await import('../../src/index.js');
      const { start } = createBot();
      
      expect(start).toBeDefined();
      const result = start();
      expect(result).toBeInstanceOf(Promise);
      await result;
    });

    it('stop debe ser una función async', async () => {
      const { createBot } = await import('../../src/index.js');
      const { start, stop } = createBot();
      
      await start();
      const result = stop();
      expect(result).toBeInstanceOf(Promise);
      await result;
    });
  });

  describe('setupSignalHandlers', () => {
    it('debe exportar setupSignalHandlers', async () => {
      const { setupSignalHandlers } = await import('../../src/index.js');
      expect(setupSignalHandlers).toBeDefined();
      expect(typeof setupSignalHandlers).toBe('function');
    });
  });
});