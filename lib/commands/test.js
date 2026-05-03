/**
 * Comandos de prueba/test
 * Comandos simples para testing
 */

module.exports = {
  /**
   * Comando prueba
   * @param {Object} params - Dependencias
   */
  prueba: (params) => {
    const { enviar } = params
    enviar(`Este es un comando de prueba 🌟🌟

......`)
  },

  /**
   * Comando comando2
   * @param {Object} params - Dependencias
   */
  comando2: (params) => {
    const { enviar } = params
    enviar(`🧩Este es un comando nuevo`)
  }
}