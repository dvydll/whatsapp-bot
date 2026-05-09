/**
 * Comandos de información - Simplified
 */

export default {
  botcompleto: (params: any) => {
    const { enviar } = params;
    enviar('Información del bot completa...');
  },

  grupos: (params: any) => {
    const { enviar } = params;
    enviar('Grupo oficial: link');
  },

  serbot: (params: any) => {
    const { enviar } = params;
    enviar('Para ser bot visita nuestra web');
  },
};