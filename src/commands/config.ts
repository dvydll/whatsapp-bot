/**
 * Comandos de configuración - Simplified
 */

export default {
  boton: (params: any) => {
    const { isOwner, botActivo, guardarEstadoBot, enviar, respuesta } = params;
    if (!isOwner) return enviar(respuesta.miowner);
    if (botActivo) return enviar('El bot ya está encendido');
    guardarEstadoBot(true);
    enviar('Bot activado');
  },

  botoff: (params: any) => {
    const { isOwner, botActivo, guardarEstadoBot, enviar } = params;
    if (!isOwner) return enviar('Solo el owner');
    if (!botActivo) return enviar('El bot ya está apagado');
    guardarEstadoBot(false);
    enviar('Bot desactivado');
  },
};