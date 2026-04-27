// Default configurations
export const Defaults = {
  PREFIX: '.',
  TIMEZONE: 'America/Lima',
  COOLDOWN_MS: 3000,
  MAX_COINS: 1000000,
  WELCOME_DELAY_MS: 5000,
  /** Default log level */
  LOG_LEVEL: 'info' as const,
  /** Default node environment */
  NODE_ENV: 'development' as const,
} as const;

export type Defaults = typeof Defaults;