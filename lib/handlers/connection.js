/**
 * Connection handler - extraído de index.js
 * Maneja connection.update events
 */

// Mensajes de conexión
const connectionMessages = {
  open: '✅ Conectado exitosamente',
  close: '⚠️ Conexión cerrada, reconectando...',
  connecting: '⌛ Conectando...'
}

/**
 * Crea el handler de conexión
 * @param {Object} sock - Socket de Baileys
 * @param {Function} onDisconnect - Callback cuando se desconecta
 */
function createConnectionHandler(sock, onDisconnect) {
  // Limpiar carpeta tmp al conectar
  const { exec } = require('child_process')

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'close') {
      // Determinar razón de desconexión
      const reason = lastDisconnect?.error?.output?.statusCode

      if (reason === 'logout') {
        console.log('❌ Sesión cerrada. Borra la carpeta "session" y vuelve a emparejar.')
      } else {
        console.log(connectionMessages.close)
        // Reconectar
        if (onDisconnect) {
          onDisconnect()
        }
      }
    } else if (connection === 'open') {
      console.log(connectionMessages.open)
      // Limpiar tmp
      exec('rm -rf tmp && mkdir tmp', (err) => {
        if (err) console.log('Error cleaning tmp:', err)
      })
    }
  })

  return {
    connectionMessages
  }
}

module.exports = {
  createConnectionHandler,
  connectionMessages
}