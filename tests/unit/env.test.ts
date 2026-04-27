/**
 * Tests para validación de esquema de entorno
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { envSchema } from '../../src/config/env.js';

describe('envSchema', () => {
  const validEnv = {
    BOT_NAME: 'TestBot',
    OWNER_JID: '123456789@s.whatsapp.net',
    BOT_PREFIX: '#',
    NAUFRA_KEY: 'test-key-123',
    TIMEZONE: 'America/Lima',
    LOG_LEVEL: 'info',
    NODE_ENV: 'development',
  };

  describe('validaciones exitosas', () => {
    it('debe parsear un entorno válido', () => {
      const result = envSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.BOT_NAME).toBe('TestBot');
      }
    });

    it('debe aceptar OWNER_JID con formato lid', () => {
      const result = envSchema.safeParse({
        ...validEnv,
        OWNER_JID: '123456789@s.whatsapp.lid',
      });
      expect(result.success).toBe(true);
    });

    it('debe aceptar múltiples prefijos de comando', () => {
      const result = envSchema.safeParse({
        ...validEnv,
        BOT_PREFIX: '#,/',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.BOT_PREFIX).toBe('#,/');
      }
    });

    it('debe aceptar todos los niveles de log válidos', () => {
      const levels = ['debug', 'info', 'warn', 'error'] as const;
      for (const level of levels) {
        const result = envSchema.safeParse({ ...validEnv, LOG_LEVEL: level });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('validaciones de error', () => {
    it('debe fallar si BOT_NAME está vacío', () => {
      const result = envSchema.safeParse({ ...validEnv, BOT_NAME: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('BOT_NAME');
      }
    });

    it('debe fallar si BOT_NAME no está definido', () => {
      const { BOT_NAME, ...rest } = validEnv;
      const result = envSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('debe fallar si OWNER_JID no tiene formato válido', () => {
      const result = envSchema.safeParse({ ...validEnv, OWNER_JID: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('debe fallar si OWNER_JID no tiene prefijo numérico', () => {
      const result = envSchema.safeParse({
        ...validEnv,
        OWNER_JID: 'abc@s.whatsapp.net',
      });
      expect(result.success).toBe(false);
    });

    it('debe fallar si LOG_LEVEL es inválido', () => {
      const result = envSchema.safeParse({ ...validEnv, LOG_LEVEL: 'verbose' });
      expect(result.success).toBe(false);
    });

    it('debe fallar si NODE_ENV es inválido', () => {
      const result = envSchema.safeParse({ ...validEnv, NODE_ENV: 'staging' });
      expect(result.success).toBe(false);
    });

    it('debe fallar si falta NAUFRA_KEY', () => {
      const { NAUFRA_KEY, ...rest } = validEnv;
      const result = envSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('debe fallar si falta TIMEZONE', () => {
      const { TIMEZONE, ...rest } = validEnv;
      const result = envSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('debe fallar si BOT_PREFIX está vacío', () => {
      const result = envSchema.safeParse({ ...validEnv, BOT_PREFIX: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('inferencia de tipos', () => {
    it('debe inferir tipos correctamente', () => {
      const result = envSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
      if (result.success) {
        const config = result.data;
        // Verificar que los tipos son correctos
        const _name: string = config.BOT_NAME;
        const _logLevel: 'debug' | 'info' | 'warn' | 'error' = config.LOG_LEVEL;
        const _nodeEnv: 'development' | 'production' = config.NODE_ENV;
      }
    });
  });

  describe('casos edge', () => {
    it('debe aceptar prefijos de un solo carácter', () => {
      const result = envSchema.safeParse({ ...validEnv, BOT_PREFIX: '!' });
      expect(result.success).toBe(true);
    });

    it('debe aceptar prefijos de hasta 5 caracteres', () => {
      const result = envSchema.safeParse({ ...validEnv, BOT_PREFIX: '!!!!!' });
      expect(result.success).toBe(true);
    });

    it('debe rechazar prefijos de más de 5 caracteres', () => {
      const result = envSchema.safeParse({ ...validEnv, BOT_PREFIX: '!!!!!!' });
      expect(result.success).toBe(false);
    });

    it('debe aceptar NODE_ENV production', () => {
      const result = envSchema.safeParse({ ...validEnv, NODE_ENV: 'production' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe('production');
      }
    });
  });
});