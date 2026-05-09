/**
 * Comandos de Herramientas - Simplified TS
 */

import { fetchJson } from '../http/download.js';

interface ToolHandler {
  (params: any): void | Promise<void>;
}

export const toolCommands: Record<string, { aliases: string[]; handler: ToolHandler }> = {
  sticker: {
    aliases: ['s', 'sticker'],
    handler: async (params: any) => {
      const { isReg, enviar, respuesta, economy, sender } = params;
      if (!isReg) return enviar(respuesta.registro);
      params.enviar('Creando sticker...');
      await economy.addXp(sender, 1);
      await economy.delkoin(sender, 1);
      params.enviar('Sticker creado!');
    },
  },

  attp: {
    aliases: ['attp', 'attp2', 'attp3'],
    handler: async (params: any) => {
      const { q, from, isReg, enviar, respuesta, sock, APINAUFRA, NAUFRA_KEY } = params;
      if (!isReg) return enviar(respuesta.registro);
      if (!q) return enviar('Escribe un texto');
      params.enviar('Creando sticker...');
    },
  },

  gpt: {
    aliases: ['gpt', 'gpt4', 'openai', 'chatgpt', 'ia'],
    handler: async (params: any) => {
      const { q, from, enviar, sock, info, APINAUFRA, NAUFRA_KEY } = params;
      if (!q) return enviar('Escribe una pregunta');
      const url = `${APINAUFRA}/chatgpt?apikey=${NAUFRA_KEY}&prompt=${encodeURIComponent(q)}&t=${Date.now()}`;
      const data = await fetchJson(url);
      await sock.sendMessage(from, { text: `IA: ${data.respuesta}` }, { quoted: info });
    },
  },
};

export default toolCommands;