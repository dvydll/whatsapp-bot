/**
 * Configuración de variables de entorno con validación Zod
 * @module config/env
 */

import { z } from 'zod';

/**
 * Esquema de validación para variables de entorno
 * @description Define reglas de validación para cada variable requerida
 */
export const envSchema = z.object({
  /** Nombre del bot para display y respuestas */
  BOT_NAME: z.string().min(1, 'BOT_NAME es requerido'),

  /** JID del propietario (formato WhatsApp: numero@s.whatsapp.net) */
  OWNER_JID: z
    .string()
    .min(1, 'OWNER_JID es requerido')
    .regex(/^\d+@(s\.)?whatsapp\.(net|lid)$/, 'OWNER_JID debe tener formato WhatsApp válido'),

  /** Prefijo para comandos (caracteres separadores permitidos) */
  BOT_PREFIX: z
    .string()
    .min(1, 'BOT_PREFIX es requerido')
    .regex(/^[\s\S]{1,5}$/, 'BOT_PREFIX debe tener entre 1-5 caracteres'),

  /** Clave API de Naufrabot */
  NAUFRA_KEY: z.string().min(1, 'NAUFRA_KEY es requerida'),

  /** Zona horaria IANA (ej: America/Lima, UTC) */
  TIMEZONE: z.string().min(1, 'TIMEZONE es requerida'),

  /** Nivel de logging */
  LOG_LEVEL: z.enum({
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error',
  }),

  /** Entorno de ejecución */
  NODE_ENV: z.enum({
    development: 'development',
    production: 'production',
  }),
});

/**
 * Tipo inferido del esquema de validación
 */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Tipo para valores opcionales (útil para config partial)
 */
export type EnvConfigOptional = Partial<EnvConfig>;

// ─── Implementación Lazy Singleton ──────────────────────────────────────────

let _cachedConfig: EnvConfig | null = null;

/**
 * Valida y parsea las variables de entorno
 * @throws Error si faltan variables requeridas o son inválidas
 * @returns Objeto con configuración validada
 */
function parseEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map(
      (e) => `  - ${e.path.join('.')}: ${e.message}`
    );
    throw new Error(
      `Error de validación en variables de entorno:\n${errors.join('\n')}`
    );
  }

  return result.data;
}

/**
 * Obtiene la configuración validada (singleton lazy)
 * @throws Error si faltan variables requeridas o son inválidas
 */
export function getConfig(): Readonly<EnvConfig> {
  if (_cachedConfig === null) {
    _cachedConfig = parseEnv();

    if (_cachedConfig.NODE_ENV === 'development') {
      console.info('[ENV] Configuración cargada correctamente');
    }
  }

  return _cachedConfig;
}

/**
 * Proxy que permite acceder a la config como objeto
 * pero inicializa lazily al primer acceso
 */
export const config: Readonly<EnvConfig> = new Proxy({} as Readonly<EnvConfig>, {
  get(_target, prop) {
    return getConfig()[prop as keyof EnvConfig];
  },
  ownKeys() {
    return Object.keys(getConfig());
  },
  getOwnPropertyDescriptor() {
    return {
      configurable: true,
      enumerable: true,
    };
  },
});

/**
 * Esquema Zod exportado para reutilización
 * @description Útil para testing o validación parcial de configs
 */
export { envSchema as schema };