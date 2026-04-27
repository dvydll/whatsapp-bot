// Environment configuration
export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  BOT_NAME: process.env.BOT_NAME ?? 'WhatsAppBot',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  API_KEY: process.env.API_KEY ?? '',
} as const;

export type EnvConfig = typeof ENV;