/**
 * Comandos de prueba/test
 * Comandos simples para testing
 */

interface CommandParams {
  enviar: (texto: string, opts?: any) => void;
}

export default {
  /**
   * Comando prueba
   * @param params - Dependencias
   */
  prueba: (params: CommandParams) => {
    const { enviar } = params
    enviar(`Este es un comando de prueba 🌟🌟

......`)
  },

  /**
   * Comando comando2
   * @param params - Dependencias
   */
  comando2: (params: CommandParams) => {
    const { enviar } = params
    enviar(`🧩Este es un comando nuevo`)
  }
}