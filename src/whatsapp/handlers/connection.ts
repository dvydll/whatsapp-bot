/**
 * Connection handler - extraído de index.js
 * Maneja connection.update events
 */

import { Boom } from '@hapi/boom';
import { DisconnectReason, type WASocket } from 'baileys';
import { exec } from 'node:child_process';

// Mensajes de conexión
const connectionMessages = {
  open: '✅ Conectado exitosamente',
  close: '⚠️ Conexión cerrada, reconectando...',
  connecting: '⌛ Conectando...',
};

const onOpenConnection = (): void => {
  console.info(`[createConnectionHandler] ${connectionMessages.open}`);
  // Limpiar tmp
  exec('rm -rf tmp && mkdir tmp', (err) => {
    if (err) console.error('Error cleaning tmp:', err);
  });
};

/**
 * @param lastDisconnect - Reason de desconexión
 * @param onDisconnect Callback para reconectar
 */
const onCloseConnection = (lastDisconnect: { error?: Error }, onDisconnect?: () => void): void => {
  // Determinar razón de desconexión
  const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

  if (reason === DisconnectReason.loggedOut) {
    console.info(
      '[createConnectionHandler]',
      '❌ Sesión cerrada. Borra la carpeta "session" y vuelve a emparejar.',
    );
    return; // No reconectar automáticamente
  }

  console.info(`[createConnectionHandler] ${connectionMessages.close}`);
  onDisconnect?.(); // Reconectar
};

/**
 * Crea el handler de conexión
 * @param onDisconnect - Callback cuando se desconecta
 */
export const onConnectionUpdate = (onDisconnect?: () => void) =>
  /**
   * Handler para connection.update
   * @param ev - Evento de conexión
   */
  async ({ connection, lastDisconnect }: {
    connection: string;
    lastDisconnect?: { error?: Error } | undefined;
  }): Promise<void> => {
    if (connection === 'open') return onOpenConnection();
    if (connection === 'close' && lastDisconnect) onCloseConnection(lastDisconnect, onDisconnect);
  };